package repositories

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/G-Villarinho/book-wise-api/internal"
	"github.com/G-Villarinho/book-wise-api/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuthorRepository interface {
	CreateAuthor(ctx context.Context, author models.Author) error
	UpdateAuthorAvatar(ctx context.Context, authorID, avatarImageClientID uuid.UUID, avatarURL string) error
	GetAllAuthors(ctx context.Context) ([]models.Author, error)
	GetPaginatedAuthors(ctx context.Context, pagination *models.AuthorPagination) (*models.PaginatedResponse[models.Author], error)
	DeleteAuthorByID(ctx context.Context, ID uuid.UUID) error
	GetAuthorByID(ctx context.Context, ID uuid.UUID) (*models.Author, error)
	GetAuthorsByID(ctx context.Context, IDs []uuid.UUID) ([]models.Author, error)
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

func (a *authorRepository) CreateAuthor(ctx context.Context, author models.Author) error {
	if err := a.DB.WithContext(ctx).Create(&author).Error; err != nil {
		return err
	}

	return nil
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

func (a *authorRepository) UpdateAuthorAvatar(ctx context.Context, authorID, avatarImageClientID uuid.UUID, avatarURL string) error {
	if err := a.DB.WithContext(ctx).
		Model(&models.Author{}).
		Where("id = ?", authorID.String()).
		Updates(models.Author{AvatarURL: sql.NullString{String: avatarURL, Valid: avatarURL != ""}, AvatarImageClientID: avatarImageClientID}).Error; err != nil {
		return err
	}

	return nil
}

func (a *authorRepository) GetPaginatedAuthors(ctx context.Context, pagination *models.AuthorPagination) (*models.PaginatedResponse[models.Author], error) {
	query := a.DB.WithContext(ctx).Model(&models.Author{})

	if pagination.AuthorID != nil {
		query = query.Where("Authors.Id LIKE ?", fmt.Sprintf("%%%s%%", *pagination.AuthorID))
	}

	if pagination.FullName != nil {
		query = query.Where("Authors.FullName LIKE ?", fmt.Sprintf("%%%s%%", *pagination.FullName))
	}

	authors, err := paginate[models.Author](query, &pagination.Pagination, &models.Author{})
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return authors, nil
}

func (a *authorRepository) DeleteAuthorByID(ctx context.Context, ID uuid.UUID) error {
	if err := a.DB.
		WithContext(ctx).
		Where("Id = ?", ID).
		Delete(&models.Author{}).Error; err != nil {
		return err
	}

	return nil
}

func (a *authorRepository) GetAuthorByID(ctx context.Context, ID uuid.UUID) (*models.Author, error) {
	var author models.Author
	if err := a.DB.
		WithContext(ctx).
		Where("Id = ?", ID).
		First(&author).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	return &author, nil
}

func (a *authorRepository) GetAuthorsByID(ctx context.Context, IDs []uuid.UUID) ([]models.Author, error) {
	var authors []models.Author

	if err := a.DB.WithContext(ctx).Where("Id IN ?", IDs).Find(&authors).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	return authors, nil
}
