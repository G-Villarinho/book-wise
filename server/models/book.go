package models

import (
	"errors"

	"github.com/google/uuid"
)

var (
	ErrSearchBooksEmpty = errors.New("no books found matching the search criteria")
)

type Book struct {
	BaseModel
	Title            string `gorm:"column:Title;type:varchar(500);not null"`
	Description      string `gorm:"column:Description;type:varchar(2000);not null"`
	TotalPages       uint   `gorm:"column:TotalPages;type:INT UNSIGNED;not null;default:0"`
	TotalEvaluations uint   `gorm:"column:TotalEvaluations;type:INT UNSIGNED;not null;default:0"`
	CoverImageURL    string `gorm:"column:Avatar;type:varchar(500);not null"`

	Categories []Category `gorm:"many2many:BookCategories;"`
	Authors    []Author   `gorm:"many2many:BookAuthors;"`
}

func (b *Book) TableName() string {
	return "Books"
}

type CreateBookPayload struct {
	Title         string   `json:"title" validate:"required,min=1,max=500"`
	Description   string   `json:"description" validate:"required,min=1,max=2000"`
	TotalPages    uint     `json:"totalPages" validate:"required,min=1"`
	CoverImageURL string   `json:"coverImageURL" validate:"required,url,max=500"`
	Authors       []string `json:"authors" validate:"required,min=1,dive,required,min=1,max=255"`
	Categories    []string `json:"categories" validate:"required,min=1,dive,required,min=1,max=255"`
}

type BookSearchResponse struct {
	TotalPages    uint     `json:"totalPages"`
	Title         string   `json:"title"`
	Description   string   `json:"description"`
	CoverImageURL string   `json:"coverImageURL"`
	Authors       []string `json:"authors"`
	Categories    []string `json:"categories"`
}

type BookResponse struct {
	TotalPages       uint     `json:"totalPages"`
	TotalEvaluations uint     `json:"totalEvaluations"`
	Title            string   `json:"title"`
	Description      string   `json:"description"`
	CoverImageURL    string   `json:"coverImageURL"`
	Authors          []string `json:"authors"`
	Categories       []string `json:"categories"`
}

func (payload *CreateBookPayload) ToBook(authors []Author, categories []Category) *Book {
	ID, _ := uuid.NewV7()

	return &Book{
		BaseModel: BaseModel{
			ID: ID,
		},
		Title:         payload.Title,
		Description:   payload.Description,
		TotalPages:    payload.TotalPages,
		CoverImageURL: payload.CoverImageURL,
		Authors:       authors,
		Categories:    categories,
	}
}
