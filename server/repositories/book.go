package repositories

import (
	"context"
	"errors"
	"fmt"

	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BookRepository interface {
	CreateBook(ctx context.Context, book *models.Book) (*models.Book, error)
	GetBookByID(ctx context.Context, ID uuid.UUID, preload bool) (*models.Book, error)
	GetPaginatedBooks(ctx context.Context, pagination *models.BookPagination) (*models.PaginatedResponse[models.Book], error)
	DeleteBookByID(ctx context.Context, ID uuid.UUID) error
	UpdatePublicationStatus(ctx context.Context, ID uuid.UUID, publishedStatus bool) error
	DeleteBooksByAuthorID(ctx context.Context, authorID uuid.UUID) error
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

func (r *bookRepository) GetBookByID(ctx context.Context, ID uuid.UUID, preload bool) (*models.Book, error) {
	var book *models.Book
	query := r.DB.WithContext(ctx).Where("Id = ?", ID)

	if preload {
		query = query.Preload("Authors").Preload("Categories")
	}

	if err := query.First(&book).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return book, nil
}

func (r *bookRepository) GetPaginatedBooks(ctx context.Context, pagination *models.BookPagination) (*models.PaginatedResponse[models.Book], error) {
	query := r.DB.WithContext(ctx).
		Model(&models.Book{}).
		Preload("Categories").
		Preload("Authors")

	if pagination.BookID != nil {
		query = query.Where("Books.Id LIKE ?", fmt.Sprintf("%%%s%%", *pagination.BookID))
	}

	if pagination.Title != nil {
		query = query.Where("Books.Title LIKE ?", fmt.Sprintf("%%%s%%", *pagination.Title))
	}

	if pagination.AuthorID != nil {
		query = query.Joins("JOIN BookAuthors ON BookAuthors.BookID = Books.Id").
			Where("BookAuthors.AuthorID = ?", *pagination.AuthorID)
	}

	if pagination.CategoryID != nil {
		query = query.Joins("JOIN BookCategories ON BookCategories.BookID = Books.Id").
			Where("BookCategories.CategoryID = ?", *pagination.CategoryID)
	}

	orders, err := paginate[models.Book](query, &pagination.Pagination, &models.Book{})
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return orders, nil

}

func (r *bookRepository) DeleteBookByID(ctx context.Context, ID uuid.UUID) error {
	if err := r.DB.WithContext(ctx).Where("Id = ?", ID.String()).Delete(&models.Book{}).Error; err != nil {
		return err
	}

	return nil
}

func (r *bookRepository) UpdatePublicationStatus(ctx context.Context, ID uuid.UUID, publishedStatus bool) error {
	if err := r.DB.WithContext(ctx).Model(&models.Book{}).Where("Id = ?", ID.String()).UpdateColumn("Published", publishedStatus).Error; err != nil {
		return err
	}

	return nil
}

func (r *bookRepository) DeleteBooksByAuthorID(ctx context.Context, authorID uuid.UUID) error {
	err := r.DB.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var books []models.Book
		if err := tx.Joins("JOIN BookAuthors ON BookAuthors.BookID = Books.Id").
			Where("BookAuthors.AuthorID = ?", authorID).
			Find(&books).Error; err != nil {
			return err
		}

		if err := tx.Exec("DELETE FROM BookAuthors WHERE AuthorID = ?", authorID).Error; err != nil {
			return err
		}

		for _, book := range books {
			if err := tx.Delete(&book).Error; err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		return err
	}

	return nil
}
