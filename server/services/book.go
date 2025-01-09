package services

import (
	"context"
	"fmt"

	"github.com/G-Villarinho/book-wise-api/clients"
	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
)

type BookService interface {
	SearchBook(ctx context.Context, query string, page int) ([]models.BookSearchResponse, error)
}

type bookService struct {
	di               *internal.Di
	googleBookClient clients.GoogleBookClient
}

func NewBookService(di *internal.Di) (BookService, error) {
	googleBookClient, err := internal.Invoke[clients.GoogleBookClient](di)
	if err != nil {
		return nil, err
	}

	return &bookService{
		di:               di,
		googleBookClient: googleBookClient,
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
