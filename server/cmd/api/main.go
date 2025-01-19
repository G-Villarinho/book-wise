package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/G-Villarinho/book-wise-api/cache"
	"github.com/G-Villarinho/book-wise-api/clients"
	"github.com/G-Villarinho/book-wise-api/cmd/api/handler"
	"github.com/G-Villarinho/book-wise-api/config"
	"github.com/G-Villarinho/book-wise-api/database"
	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/repositories"
	"github.com/G-Villarinho/book-wise-api/services"
	"github.com/G-Villarinho/book-wise-api/services/email"
	"github.com/G-Villarinho/book-wise-api/templates"
	"github.com/go-redis/redis/v8"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/gorm"
)

func main() {
	config.ConfigureLogger()
	config.LoadEnvironments()

	e := echo.New()
	di := internal.NewDi()

	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: `[${time_rfc3339}] ${method} ${uri} ${status} ${latency_human} ${bytes_in} bytes_in ${bytes_out} bytes_out` + "\n",
	}))

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{config.Env.AdminFrontURL, config.Env.MemberFrontURL},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowCredentials: true,
	}))

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	db, err := database.NewMysqlConnection(ctx)
	if err != nil {
		log.Fatal("error to connect to database: ", err)
	}

	redisClient, err := database.NewRedisConnection(ctx)
	if err != nil {
		log.Fatal("error to connect to redis: ", err)
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

	internal.Provide(di, func(d *internal.Di) (*redis.Client, error) {
		return redisClient, nil
	})

	internal.Provide(di, clients.NewMailtrapClient)
	internal.Provide(di, clients.NewGoogleBookClient)
	internal.Provide(di, clients.NewCloudFlareImageClient)

	internal.Provide(di, handler.NewAuthHandler)
	internal.Provide(di, handler.NewAuthorHandler)
	internal.Provide(di, handler.NewBookHandler)
	internal.Provide(di, handler.NewCategoryHandler)
	internal.Provide(di, handler.NewUserHandler)

	internal.Provide(di, email.NewEmailService)
	internal.Provide(di, cache.NewRedisCache)
	internal.Provide(di, templates.NewTemplateService)

	internal.Provide(di, services.NewAuthService)
	internal.Provide(di, services.NewAuthorService)
	internal.Provide(di, services.NewBookService)
	internal.Provide(di, services.NewCategoryService)
	internal.Provide(di, services.NewEvaluationService)
	internal.Provide(di, services.NewImageService)
	internal.Provide(di, services.NewQueueService)
	internal.Provide(di, services.NewSessionService)
	internal.Provide(di, services.NewTokenService)
	internal.Provide(di, services.NewUserService)

	internal.Provide(di, repositories.NewAuthorRepository)
	internal.Provide(di, repositories.NewBookRepository)
	internal.Provide(di, repositories.NewCategoryRepository)
	internal.Provide(di, repositories.NewEvaluationRepository)
	internal.Provide(di, repositories.NewUserRepository)

	handler.SetupRoutes(e, di)
	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", config.Env.APIPort)))
}
