package services

import (
	"context"
	"fmt"

	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"github.com/G-Villarinho/book-wise-api/repositories"
	"github.com/G-Villarinho/book-wise-api/utils"
	"github.com/google/uuid"
	jsoniter "github.com/json-iterator/go"
)

type AuthorService interface {
	CreateAuthor(ctx context.Context, payload models.CreateAuthorPayload) error
	FindOrCreateAuthors(ctx context.Context, fullNames []string) ([]models.Author, error)
	GetAllAuthors(ctx context.Context) ([]models.AuthorBasicInfoResponse, error)
	GetPaginatedAuthors(ctx context.Context, pagination *models.AuthorPagination) (*models.PaginatedResponse[*models.AuthorDetailsResponse], error)
	DeleteAuthorByID(ctx context.Context, ID uuid.UUID) error
}

type authorService struct {
	di               *internal.Di
	queueService     QueueService
	authorRepository repositories.AuthorRepository
	bookRepository   repositories.BookRepository
}

func NewAuthorService(di *internal.Di) (AuthorService, error) {
	queueService, err := internal.Invoke[QueueService](di)
	if err != nil {
		return nil, err
	}

	authorRepository, err := internal.Invoke[repositories.AuthorRepository](di)
	if err != nil {
		return nil, err
	}

	bookRepository, err := internal.Invoke[repositories.BookRepository](di)
	if err != nil {
		return nil, err
	}

	return &authorService{
		di:               di,
		queueService:     queueService,
		authorRepository: authorRepository,
		bookRepository:   bookRepository,
	}, nil
}

func (a *authorService) CreateAuthor(ctx context.Context, payload models.CreateAuthorPayload) error {
	author := payload.ToAuthor()

	if err := a.authorRepository.CreateAuthor(ctx, *author); err != nil {
		return fmt.Errorf("create author: %w", err)
	}

	image, err := utils.ConvertImageToBytes(payload.Image)
	if err != nil {
		return err
	}

	task := models.ImageUploadTask{
		RecordID: author.ID,
		Image:    image,
	}

	message, err := jsoniter.Marshal(task)
	if err != nil {
		return fmt.Errorf("marshal upload image task: %w", err)
	}

	if err := a.queueService.Publish(string(UploadAuthorImage), message); err != nil {
		return err
	}

	return nil
}

func (a *authorService) FindOrCreateAuthors(ctx context.Context, fullNames []string) ([]models.Author, error) {
	return nil, nil
}

func (a *authorService) GetAllAuthors(ctx context.Context) ([]models.AuthorBasicInfoResponse, error) {
	authors, err := a.authorRepository.GetAllAuthors(ctx)
	if err != nil {
		return nil, fmt.Errorf("get all authors: %w", err)
	}

	if authors == nil {
		return nil, models.ErrAuthorsNotFound
	}

	var authorsResponse []models.AuthorBasicInfoResponse
	for _, author := range authors {
		authorsResponse = append(authorsResponse, *author.ToAuthorBasicInfoResponse())
	}

	return authorsResponse, nil
}

func (a *authorService) GetPaginatedAuthors(ctx context.Context, pagination *models.AuthorPagination) (*models.PaginatedResponse[*models.AuthorDetailsResponse], error) {
	pagiantedAuthors, err := a.authorRepository.GetPaginatedAuthors(ctx, pagination)
	if err != nil {
		return nil, fmt.Errorf("get paginated authors: %w", err)
	}

	paginatedAuthorsResponse := models.MapPaginatedResult(pagiantedAuthors, func(author models.Author) *models.AuthorDetailsResponse {
		return author.ToAuthorDetailsResponse()
	})

	return paginatedAuthorsResponse, err
}

func (a *authorService) DeleteAuthorByID(ctx context.Context, ID uuid.UUID) error {
	author, err := a.authorRepository.GetAuthorByID(ctx, ID)
	if err != nil {
		return fmt.Errorf("get author by id %q: %w", ID, err)
	}

	if author == nil {
		return models.ErrAuthorsNotFound
	}

	if err := a.bookRepository.DeleteBooksByAuthorID(ctx, ID); err != nil {
		return fmt.Errorf("delete books by author id %q: %w", ID, err)
	}

	if err := a.authorRepository.DeleteAuthorByID(ctx, ID); err != nil {
		return fmt.Errorf("delete author by id %q: %w", ID, err)
	}

	return nil
}
