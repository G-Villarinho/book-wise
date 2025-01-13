package repositories

import (
	"context"
	"errors"

	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"gorm.io/gorm"
)

type AuthorRepository interface {
	CreateBatch(ctx context.Context, authors []models.Author) error
	GetAuthorsByNormalizeFullNames(ctx context.Context, normalizeFullNames []string) ([]models.Author, error)
	GetAllAuthors(ctx context.Context) ([]models.Author, error)
}

type authorRepository struct {
	di *internal.Di
	DB *gorm.DB
}

func NewAuthorRepository(di *internal.Di) (AuthorRepository, error) {
	DB, err := internal.Invoke[*gorm.DB](di)
	if err != nil {
		return nil, err
	}

	return &authorRepository{
		di: di,
		DB: DB,
	}, nil
}

func (a *authorRepository) CreateBatch(ctx context.Context, authors []models.Author) error {
	if err := a.DB.WithContext(ctx).Create(&authors).Error; err != nil {
		return err
	}

	return nil
}

func (a *authorRepository) GetAuthorsByNormalizeFullNames(ctx context.Context, normalizeFullNames []string) ([]models.Author, error) {
	var authors []models.Author

	if err := a.DB.WithContext(ctx).Where("NormalizedFullName IN ?", normalizeFullNames).Find(&authors).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	return authors, nil
}

func (a *authorRepository) GetAllAuthors(ctx context.Context) ([]models.Author, error) {
	var authors []models.Author

	if err := a.DB.WithContext(ctx).Find(&authors).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	return authors, nil
}
