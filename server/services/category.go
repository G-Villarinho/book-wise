package services

import (
	"context"
	"fmt"

	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"github.com/G-Villarinho/book-wise-api/repositories"
	"github.com/G-Villarinho/book-wise-api/utils"
	"github.com/google/uuid"
)

type CategoryService interface {
	FindOrCreateCategories(ctx context.Context, names []string) ([]models.Category, error)
	GetAllCategories(ctx context.Context) ([]models.CategoryResponse, error)
}

type categoryService struct {
	di                 *internal.Di
	categoryRepository repositories.CategoryRepository
}

func NewCategoryService(di *internal.Di) (CategoryService, error) {
	categoryRepository, err := internal.Invoke[repositories.CategoryRepository](di)
	if err != nil {
		return nil, err
	}

	return &categoryService{
		di:                 di,
		categoryRepository: categoryRepository,
	}, nil
}

func (c *categoryService) FindOrCreateCategories(ctx context.Context, names []string) ([]models.Category, error) {
	var normalizedNames []string

	for _, name := range names {
		normalizedNames = append(normalizedNames, utils.NormalizeString(name))
	}

	existingCategories, err := c.categoryRepository.GetCategoriesByNormalizeNames(ctx, normalizedNames)
	if err != nil {
		return nil, fmt.Errorf("get categories by normalized names: %v", err)
	}

	existingMap := make(map[string]struct{})
	for _, category := range existingCategories {
		existingMap[category.NormalizedName] = struct{}{}
	}

	var newCategories []models.Category
	for _, name := range names {
		ID, err := uuid.NewV7()
		if err != nil {
			return nil, fmt.Errorf("genereate id key: %v", err)
		}

		normalizedName := utils.NormalizeString(name)
		if _, exists := existingMap[normalizedName]; !exists {
			newCategories = append(newCategories, models.Category{
				BaseModel: models.BaseModel{
					ID: ID,
				},
				Name:           name,
				NormalizedName: normalizedName,
			})
		}
	}

	if len(newCategories) > 0 {
		if err = c.categoryRepository.CreateBatch(ctx, newCategories); err != nil {
			return nil, fmt.Errorf("create batch: %v", err)
		}
	}

	return append(existingCategories, newCategories...), nil
}

func (c *categoryService) GetAllCategories(ctx context.Context) ([]models.CategoryResponse, error) {
	categories, err := c.categoryRepository.GetAllCategories(ctx)
	if err != nil {
		return nil, fmt.Errorf("get all categories: %w", err)
	}

	if categories == nil {
		return nil, models.ErrCategoriesNotFound
	}

	var categoriesResponse []models.CategoryResponse
	for _, category := range categories {
		categoriesResponse = append(categoriesResponse, *category.ToCategoryResponse())
	}

	return categoriesResponse, nil
}
