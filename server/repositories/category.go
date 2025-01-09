package repositories

import (
	"context"
	"errors"

	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"gorm.io/gorm"
)

type CategoryRepository interface {
	CreateBatch(ctx context.Context, categories []models.Category) error
	GetCategoriesByNormalizeNames(ctx context.Context, normalizedNames []string) ([]models.Category, error)
}

type categoryRepository struct {
	di *internal.Di
	DB *gorm.DB
}

func NewCategoryRepositry(di *internal.Di) (CategoryRepository, error) {
	db, err := internal.Invoke[*gorm.DB](di)
	if err != nil {
		return nil, err
	}

	return &categoryRepository{
		di: di,
		DB: db,
	}, nil
}

func (c *categoryRepository) CreateBatch(ctx context.Context, categories []models.Category) error {
	if err := c.DB.Create(&categories).Error; err != nil {
		return err
	}

	return nil
}

func (c *categoryRepository) GetCategoriesByNormalizeNames(ctx context.Context, normalizedNames []string) ([]models.Category, error) {
	var categories []models.Category

	if err := c.DB.Where("NormalizedName IN ?", normalizedNames).Find(&categories).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	return categories, nil

}
