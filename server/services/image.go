package services

import (
	"context"

	"github.com/G-Villarinho/book-wise-api/clients"
	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
)

type ProcessorQueue string

const (
	UploadImageQueue ProcessorQueue = "upload_image_queue"
	DeleteImageQueue ProcessorQueue = "delete_image_queue"
)

type ImageService interface {
	UploadImage(ctx context.Context, uploadImageName string, task models.ImageUploadTask) (*models.UploadImageResponse, error)
}

type imageService struct {
	di                *internal.Di
	imageUploadClient clients.CloudFlareImageClient
}

func NewImageService(di *internal.Di) (ImageService, error) {
	imageUploadClient, err := internal.Invoke[clients.CloudFlareImageClient](di)
	if err != nil {
		return nil, err
	}

	return &imageService{
		di:                di,
		imageUploadClient: imageUploadClient,
	}, nil

}

func (i *imageService) UploadImage(ctx context.Context, uploadImageName string, task models.ImageUploadTask) (*models.UploadImageResponse, error) {
	uploadImageResponse, err := i.imageUploadClient.UploadImage(task.Image, uploadImageName)
	if err != nil {
		return nil, err
	}

	return uploadImageResponse, nil
}
