package repositories

import (
	"context"

	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"gorm.io/gorm"
)

type BookRepository interface {
	CreateBook(ctx context.Context, book *models.Book) (*models.Book, error)
}

type bookRepository struct {
	di *internal.Di
	DB *gorm.DB
}

func NewBookRepository(di *internal.Di) (BookRepository, error) {
	DB, err := internal.Invoke[*gorm.DB](di)
	if err != nil {
		return nil, err
	}

	return &bookRepository{
		di: di,
		DB: DB,
	}, nil
}

func (r *bookRepository) CreateBook(ctx context.Context, book *models.Book) (*models.Book, error) {
	err := r.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(book).Error; err != nil {
			return err
		}

		if len(book.Authors) > 0 {
			if err := tx.Model(book).Association("Authors").Append(book.Authors); err != nil {
				return err
			}
		}

		if len(book.Categories) > 0 {
			if err := tx.Model(book).Association("Categories").Append(book.Categories); err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return book, nil
}
