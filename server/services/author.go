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

type AuthorService interface {
	FindOrCreateAuthors(ctx context.Context, fullNames []string) ([]models.Author, error)
}

type authorService struct {
	di               *internal.Di
	authorRepository repositories.AuthorRepository
}

func NewAuthorService(di *internal.Di) (AuthorService, error) {
	categoryRepository, err := internal.Invoke[repositories.AuthorRepository](di)
	if err != nil {
		return nil, err
	}

	return &authorService{
		di:               di,
		authorRepository: categoryRepository,
	}, nil
}

func (a *authorService) FindOrCreateAuthors(ctx context.Context, fullNames []string) ([]models.Author, error) {
	var normalizedFullNames []string

	for _, fullName := range fullNames {
		normalizedFullNames = append(normalizedFullNames, utils.NormalizeString(fullName))
	}

	existingAuthors, err := a.authorRepository.GetAuthorsByNormalizeFullNames(ctx, normalizedFullNames)
	if err != nil {
		return nil, fmt.Errorf("get authors by normalized full names: %v", err)
	}

	existingMap := make(map[string]struct{})
	for _, author := range existingAuthors {
		existingMap[author.NormalizedFullName] = struct{}{}
	}

	var newAuthors []models.Author
	for _, fullName := range fullNames {
		ID, err := uuid.NewV7()
		if err != nil {
			return nil, fmt.Errorf("genereate id key: %v", err)
		}

		normalizedFullName := utils.NormalizeString(fullName)
		if _, exists := existingMap[normalizedFullName]; !exists {
			newAuthors = append(newAuthors, models.Author{
				BaseModel: models.BaseModel{
					ID: ID,
				},
				FullName:           fullName,
				NormalizedFullName: normalizedFullName,
			})
		}
	}

	if len(newAuthors) > 0 {
		if err = a.authorRepository.CreateBatch(ctx, newAuthors); err != nil {
			return nil, fmt.Errorf("create batch: %v", err)
		}
	}

	return append(existingAuthors, newAuthors...), nil
}
