package models

import (
	"errors"
	"strings"
	"time"

	"github.com/G-Villarinho/book-wise-api/utils"
	"github.com/google/uuid"
)

var (
	ErrSearchExternalBooksEmpty = errors.New("no external books found matching the search criteria")
	ErrExternalBookNotFound     = errors.New("no external book found from api")
	ErrBookNotFound             = errors.New("no book found in database")
	ErrBookAlreadyPublished     = errors.New("the book already has published status")
	ErrBookAlreadyUnpublished   = errors.New("the book already has unpublished status")
)

type Book struct {
	BaseModel
	Title            string `gorm:"column:Title;type:varchar(500);not null"`
	Description      string `gorm:"column:Description;type:varchar(2000);not null"`
	TotalPages       uint   `gorm:"column:TotalPages;type:INT UNSIGNED;not null;default:0"`
	TotalEvaluations uint   `gorm:"column:TotalEvaluations;type:INT UNSIGNED;not null;default:0"`
	CoverImageURL    string `gorm:"column:Avatar;type:varchar(500);not null"`
	Published        bool   `gorm:"column:Published;type:TINYINT;not null;default:0"`

	Categories []Category `gorm:"many2many:BookCategories;"`
	Authors    []Author   `gorm:"many2many:BookAuthors;"`
}

func (b *Book) TableName() string {
	return "Books"
}

type BookPagination struct {
	Pagination
	Title      *string `json:"title"`
	BookID     *string `json:"bookId"`
	AuthorID   *string `json:"authorId"`
	CategoryID *string `json:"category"`
}

type CreateBookPayload struct {
	Title         string      `json:"title" validate:"required,min=1,max=500"`
	Description   string      `json:"description" validate:"required,min=1,max=2000"`
	TotalPages    uint        `json:"totalPages" validate:"required,min=1"`
	CoverImageURL string      `json:"coverImageURL" validate:"required,url,max=500"`
	AuthorsIds    []uuid.UUID `json:"authorsIds" validate:"required,min=1,dive,required"`
	Categories    []string    `json:"categories" validate:"required,min=1,dive,required,min=1,max=255"`
}

type BookSearchResponse struct {
	ExternalBookID string   `json:"externalBookId"`
	TotalPages     uint     `json:"totalPages"`
	Title          string   `json:"title"`
	Description    string   `json:"description"`
	CoverImageURL  string   `json:"coverImageURL"`
	Authors        []string `json:"authors"`
	Categories     []string `json:"categories"`
}

type BookResponse struct {
	ID               string    `json:"id"`
	TotalPages       uint      `json:"totalPages"`
	TotalEvaluations uint      `json:"totalEvaluations"`
	Title            string    `json:"title"`
	Description      string    `json:"description"`
	CoverImageURL    string    `json:"coverImageURL"`
	Published        bool      `json:"published"`
	Authors          []string  `json:"authors"`
	Categories       []string  `json:"categories"`
	CreatedAt        time.Time `json:"createdAt"`
}

func (cbp *CreateBookPayload) ToBook(authors []Author, categories []Category) *Book {
	ID, _ := uuid.NewV7()

	return &Book{
		BaseModel: BaseModel{
			ID: ID,
		},
		Title:         cbp.Title,
		Description:   cbp.Description,
		TotalPages:    cbp.TotalPages,
		CoverImageURL: cbp.CoverImageURL,
		Authors:       authors,
		Categories:    categories,
	}
}

func (b *Book) ToBookResponse() *BookResponse {
	var authors []string
	for _, author := range b.Authors {
		authors = append(authors, author.FullName)
	}

	var categories []string
	for _, category := range b.Categories {
		categories = append(categories, category.Name)
	}

	return &BookResponse{
		ID:               b.BaseModel.ID.String(),
		TotalPages:       b.TotalPages,
		TotalEvaluations: b.TotalEvaluations,
		Title:            b.Title,
		Description:      b.Description,
		CoverImageURL:    b.CoverImageURL,
		Published:        b.Published,
		CreatedAt:        b.CreatedAt,
		Authors:          authors,
		Categories:       categories,
	}
}

func NewBookPagination(page, limit, sort, title, bookID, authorID, categoryID string) (*BookPagination, error) {
	pagination, err := NewPagination(page, limit, sort)
	if err != nil {
		return nil, err
	}

	bookPagination := &BookPagination{
		Pagination: *pagination,
		Title:      utils.GetQueryStringPointer(title),
		BookID:     utils.GetQueryStringPointer(bookID),
	}

	if strings.ToLower(authorID) == "all" {
		bookPagination.AuthorID = nil
	} else {
		bookPagination.AuthorID = utils.GetQueryStringPointer(authorID)
	}

	if strings.ToLower(categoryID) == "all" {
		bookPagination.CategoryID = nil
	} else {
		bookPagination.CategoryID = utils.GetQueryStringPointer(categoryID)
	}

	return bookPagination, nil
}
