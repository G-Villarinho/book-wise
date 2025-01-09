package services

import (
	"context"
	"fmt"

	"github.com/G-Villarinho/book-wise-api/clients"
	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"github.com/G-Villarinho/book-wise-api/repositories"
)

type BookService interface {
	SearchBook(ctx context.Context, query string, page int) ([]models.BookSearchResponse, error)
	CreateBook(ctx context.Context, payload models.CreateBookPayload) (*models.BookResponse, error)
}

type bookService struct {
	di               *internal.Di
	googleBookClient clients.GoogleBookClient
	authorService    AuthorService
	categoryService  CategoryService
	bookRepository   repositories.BookRepository
}

func NewBookService(di *internal.Di) (BookService, error) {
	googleBookClient, err := internal.Invoke[clients.GoogleBookClient](di)
	if err != nil {
		return nil, err
	}

	authorService, err := internal.Invoke[AuthorService](di)
	if err != nil {
		return nil, err
	}

	categoryService, err := internal.Invoke[CategoryService](di)
	if err != nil {
		return nil, err
	}

	bookRepository, err := internal.Invoke[repositories.BookRepository](di)
	if err != nil {
		return nil, err
	}

	return &bookService{
		di:               di,
		googleBookClient: googleBookClient,
		authorService:    authorService,
		categoryService:  categoryService,
		bookRepository:   bookRepository,
	}, nil
}

func (b *bookService) SearchBook(ctx context.Context, query string, page int) ([]models.BookSearchResponse, error) {
	volumes, err := b.googleBookClient.SearchBooks(query, page)
	if err != nil {
		return nil, fmt.Errorf("search book external api: %v", err)
	}

	if len(volumes) == 0 {
		return nil, models.ErrSearchBooksEmpty
	}

	var bookSearchsResponse []models.BookSearchResponse
	for _, volume := range volumes {
		bookSearchsResponse = append(bookSearchsResponse, *volume.ToBookSearchResponse())
	}

	return bookSearchsResponse, nil
}

func (b *bookService) CreateBook(ctx context.Context, payload models.CreateBookPayload) (*models.BookResponse, error) {
	authors, err := b.authorService.FindOrCreateAuthors(ctx, payload.Authors)
	if err != nil {
		return nil, err
	}

	categories, err := b.categoryService.FindOrCreateCategories(ctx, payload.Categories)
	if err != nil {
		return nil, err
	}

	book := payload.ToBook(authors, categories)

	createdBook, err := b.bookRepository.CreateBook(ctx, book)
	if err != nil {
		return nil, err
	}

	return &models.BookResponse{
		TotalPages:       createdBook.TotalPages,
		TotalEvaluations: createdBook.TotalEvaluations,
		Title:            createdBook.Title,
		Description:      createdBook.Description,
		CoverImageURL:    createdBook.CoverImageURL,
		Authors:          payload.Authors,
		Categories:       payload.Categories,
	}, nil
}
