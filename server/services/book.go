package services

import (
	"context"
	"fmt"

	"github.com/G-Villarinho/book-wise-api/clients"
	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"github.com/G-Villarinho/book-wise-api/repositories"
	"github.com/google/uuid"
)

type BookService interface {
	CreateBook(ctx context.Context, payload models.CreateBookPayload) (*models.BookResponse, error)
	SearchExternalBook(ctx context.Context, query string, page int) ([]models.BookSearchResponse, error)
	GetExternalBookByID(ctx context.Context, externalID string) (*models.BookSearchResponse, error)
	GetBookByID(ctx context.Context, ID uuid.UUID) (*models.BookResponse, error)
	GetPaginatedBooks(ctx context.Context, pagination *models.BookPagination) (*models.PaginatedResponse[*models.BookResponse], error)
	DeleteBookByID(ctx context.Context, ID uuid.UUID) error
	PublishBook(ctx context.Context, ID uuid.UUID) error
	UnpublishBook(ctx context.Context, ID uuid.UUID) error
	EvaluateBook(ctx context.Context, bookID uuid.UUID, payload models.CreateEvaluationPayload) (*models.EvaluationBasicInfoResponse, error)
	GetPaginatedPublishedBooks(ctx context.Context, pagination *models.PublishedBookPagination) (*models.PaginatedResponse[*models.PublishedBookResponse], error)
	GetPaginatedBookEvaluationsByID(ctx context.Context, bookID uuid.UUID, pagination *models.Pagination) (*models.PaginatedResponse[*models.EvaluationBasicInfoResponse], error)
}

type bookService struct {
	di                *internal.Di
	googleBookClient  clients.GoogleBookClient
	categoryService   CategoryService
	evaluationService EvaluationService
	authorRepository  repositories.AuthorRepository
	bookRepository    repositories.BookRepository
}

func NewBookService(di *internal.Di) (BookService, error) {
	googleBookClient, err := internal.Invoke[clients.GoogleBookClient](di)
	if err != nil {
		return nil, err
	}

	evaluationService, err := internal.Invoke[EvaluationService](di)
	if err != nil {
		return nil, err
	}

	categoryService, err := internal.Invoke[CategoryService](di)
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

	return &bookService{
		di:                di,
		googleBookClient:  googleBookClient,
		evaluationService: evaluationService,
		categoryService:   categoryService,
		authorRepository:  authorRepository,
		bookRepository:    bookRepository,
	}, nil
}

func (b *bookService) CreateBook(ctx context.Context, payload models.CreateBookPayload) (*models.BookResponse, error) {
	authors, err := b.authorRepository.GetAuthorsByID(ctx, payload.AuthorsIds)
	if err != nil {
		return nil, fmt.Errorf("get authors by ids: %w", err)
	}

	if authors == nil {
		return nil, models.ErrAuthorsNotFound
	}

	if len(authors) != len(payload.AuthorsIds) {
		return nil, models.ErrAuthorsMismatch
	}

	categories, err := b.categoryService.FindOrCreateCategories(ctx, payload.Categories)
	if err != nil {
		return nil, err
	}

	book := payload.ToBook(authors, categories)

	if err := b.bookRepository.CreateBook(ctx, book); err != nil {
		return nil, fmt.Errorf("create book: %w", err)
	}

	return book.ToBookResponse(), nil
}

func (b *bookService) SearchExternalBook(ctx context.Context, query string, page int) ([]models.BookSearchResponse, error) {
	volumes, err := b.googleBookClient.SearchBooks(ctx, query, page)
	if err != nil {
		return nil, fmt.Errorf("search book external api: %v", err)
	}

	if len(volumes) == 0 {
		return nil, models.ErrSearchExternalBooksEmpty
	}

	var bookSearchsResponse []models.BookSearchResponse
	for _, volume := range volumes {
		bookSearchsResponse = append(bookSearchsResponse, *volume.ToBookSearchResponse())
	}

	return bookSearchsResponse, nil
}

func (b *bookService) GetExternalBookByID(ctx context.Context, externalID string) (*models.BookSearchResponse, error) {
	volume, err := b.googleBookClient.GetBookByID(ctx, externalID)
	if err != nil {
		return nil, fmt.Errorf("search book external api: %v", err)
	}

	if volume == nil {
		return nil, models.ErrExternalBookNotFound
	}

	return volume.ToBookSearchResponse(), nil
}

func (b *bookService) GetBookByID(ctx context.Context, ID uuid.UUID) (*models.BookResponse, error) {
	book, err := b.bookRepository.GetBookByID(ctx, ID, true)
	if err != nil {
		return nil, fmt.Errorf("get book by id: %w", err)
	}

	if book == nil {
		return nil, models.ErrBookNotFound
	}

	return book.ToBookResponse(), nil
}

func (b *bookService) GetPaginatedBooks(ctx context.Context, pagination *models.BookPagination) (*models.PaginatedResponse[*models.BookResponse], error) {
	paginatedBooks, err := b.bookRepository.GetPaginatedBooks(ctx, pagination)
	if err != nil {
		return nil, fmt.Errorf("get paginated books: %w", err)
	}

	paginatedBooksResponse := models.MapPaginatedResult(paginatedBooks, func(book models.Book) *models.BookResponse {
		return book.ToBookResponse()
	})

	return paginatedBooksResponse, nil
}

func (b *bookService) DeleteBookByID(ctx context.Context, ID uuid.UUID) error {
	book, err := b.bookRepository.GetBookByID(ctx, ID, false)
	if err != nil {
		return fmt.Errorf("get book by id %q: %w", ID, err)
	}

	if book == nil {
		return models.ErrBookNotFound
	}

	if err := b.bookRepository.DeleteBookByID(ctx, ID); err != nil {
		return fmt.Errorf("delete book by id %q: %w", ID, err)
	}

	return nil
}

func (b *bookService) PublishBook(ctx context.Context, ID uuid.UUID) error {
	book, err := b.bookRepository.GetBookByID(ctx, ID, false)
	if err != nil {
		return fmt.Errorf("get book by id %q: %w", ID, err)
	}

	if book == nil {
		return models.ErrBookNotFound
	}

	if book.Published {
		return models.ErrBookAlreadyPublished
	}

	if err := b.bookRepository.UpdatePublicationStatus(ctx, ID, true); err != nil {
		return fmt.Errorf("update publication status book %q: %w", ID, err)
	}

	return nil
}

func (b *bookService) UnpublishBook(ctx context.Context, ID uuid.UUID) error {
	book, err := b.bookRepository.GetBookByID(ctx, ID, false)
	if err != nil {
		return fmt.Errorf("get book by id %q: %w", ID, err)
	}

	if book == nil {
		return models.ErrBookNotFound
	}

	if !book.Published {
		return models.ErrBookAlreadyUnpublished
	}

	if err := b.bookRepository.UpdatePublicationStatus(ctx, ID, false); err != nil {
		return fmt.Errorf("update publication status book %q: %w", ID, err)
	}

	return nil
}

func (b *bookService) EvaluateBook(ctx context.Context, bookID uuid.UUID, payload models.CreateEvaluationPayload) (*models.EvaluationBasicInfoResponse, error) {
	book, err := b.bookRepository.GetBookByID(ctx, bookID, true)
	if err != nil {
		return nil, fmt.Errorf("get book by id: %w", err)
	}

	if book == nil {
		return nil, models.ErrBookNotFound
	}

	evaluationBasicInfoResponse, err := b.evaluationService.CreateEvaluation(ctx, bookID, payload)
	if err != nil {
		return nil, err
	}

	return evaluationBasicInfoResponse, nil
}

func (b *bookService) GetPaginatedPublishedBooks(ctx context.Context, pagination *models.PublishedBookPagination) (*models.PaginatedResponse[*models.PublishedBookResponse], error) {
	paginatedPublishedBooks, err := b.bookRepository.GetPaginatedPublishedBooks(ctx, pagination)
	if err != nil {
		return nil, fmt.Errorf("get paginated books: %w", err)
	}

	paginatedPublishedBooksResponse := models.MapPaginatedResult(paginatedPublishedBooks, func(publishedBook models.Book) *models.PublishedBookResponse {
		rateAverage := calculateAverageRating(publishedBook.Evaluations)
		return publishedBook.ToPublishedBookResponse(rateAverage)
	})

	return paginatedPublishedBooksResponse, nil
}

func (b *bookService) GetPaginatedBookEvaluationsByID(ctx context.Context, bookID uuid.UUID, pagination *models.Pagination) (*models.PaginatedResponse[*models.EvaluationBasicInfoResponse], error) {
	book, err := b.bookRepository.GetBookByID(ctx, bookID, true)
	if err != nil {
		return nil, fmt.Errorf("get book by id %q: %w", bookID, err)
	}

	if book == nil {
		return nil, models.ErrBookNotFound
	}

	paginatedBookEvaluationsResponse, err := b.evaluationService.GetPaginatedEvaluationsByBookID(ctx, bookID, pagination)
	if err != nil {
		return nil, err
	}

	return paginatedBookEvaluationsResponse, nil
}

func calculateAverageRating(evaluations []models.Evaluation) float32 {
	var sum float32
	var count int
	for _, eval := range evaluations {
		sum += float32(eval.Rate)
		count++
	}

	if count == 0 {
		return 0
	}
	return sum / float32(count)
}
