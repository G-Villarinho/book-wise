package models

import "errors"

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

	Authors []Author `gorm:"many2many:BookAuthors;"`
}

func (b *Book) TableName() string {
	return "Books"
}

type CreateBookPayload struct {
}

type BookSearchResponse struct {
	TotalPages    uint     `json:"totalPages"`
	Title         string   `json:"title"`
	Description   string   `json:"description"`
	CoverImageURL string   `json:"coverImageURL"`
	Authors       []string `json:"authors"`
	Categories    []string `json:"categories"`
}
