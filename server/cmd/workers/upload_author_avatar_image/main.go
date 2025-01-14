package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/G-Villarinho/book-wise-api/clients"
	"github.com/G-Villarinho/book-wise-api/config"
	"github.com/G-Villarinho/book-wise-api/database"
	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"github.com/G-Villarinho/book-wise-api/repositories"
	"github.com/G-Villarinho/book-wise-api/services"
	"github.com/google/uuid"
	jsoniter "github.com/json-iterator/go"
	"gorm.io/gorm"
)

func main() {
	config.ConfigureLogger()
	config.LoadEnvironments()

	di := internal.NewDi()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	db, err := database.NewMysqlConnection(ctx)
	if err != nil {
		log.Fatal("error to connect to database: ", err)
	}

	rabbitMQClient, err := clients.NewRabbitMQClient(di)
	if err != nil {
		log.Fatal("error initializing RabbitMQ client: ", err)
	}

	if err := rabbitMQClient.Connect(); err != nil {
		log.Fatal("error connecting to RabbitMQ: ", err)
	}
	defer func() {
		if err := rabbitMQClient.Disconnect(); err != nil {
			log.Println("error disconnecting from RabbitMQ:", err)
		}
	}()

	internal.Provide(di, func(d *internal.Di) (clients.RabbitMQClient, error) {
		return rabbitMQClient, nil
	})

	internal.Provide(di, func(d *internal.Di) (*gorm.DB, error) {
		return db, nil
	})

	internal.Provide(di, clients.NewCloudFlareImageClient)
	internal.Provide(di, services.NewQueueService)
	internal.Provide(di, services.NewImageService)
	internal.Provide(di, repositories.NewAuthorRepository)

	imageService, err := internal.Invoke[services.ImageService](di)
	if err != nil {
		log.Fatal("error to create image service: ", err)
	}

	queueService, err := internal.Invoke[services.QueueService](di)
	if err != nil {
		log.Fatal("error to create queue service: ", err)
	}

	authorRepository, err := internal.Invoke[repositories.AuthorRepository](di)
	if err != nil {
		log.Fatal("error to create author repository: ", err)
	}

	for {
		messages, err := queueService.Consume(string(services.UploadImageQueue))
		if err != nil {
			log.Fatal("error to consume message from queue: ", err)
		}

		for message := range messages {
			var task models.ImageUploadTask
			if err := jsoniter.Unmarshal(message, &task); err != nil {
				log.Println("error unmarshalling upload image task: ", err)
				continue
			}

			imageName := fmt.Sprintf("author_avatar_%s", uuid.New().String())

			response, err := imageService.UploadImage(ctx, imageName, task)
			if err != nil {
				log.Printf("error to upload image %s", err.Error())
				continue
			}

			if err := authorRepository.UpdateAuthorAvatar(ctx, task.RecordID, response.ID, response.URL); err != nil {
				log.Printf("error to update author image %s", err.Error())
				continue
			}

			log.Println("image sent successfully")
		}
	}

}
