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

type UserRepository interface {
	CreateUser(ctx context.Context, user models.User) error
	GetUserByEmail(ctx context.Context, email string, roles []models.Role) (*models.User, error)
	GetUserByID(ctx context.Context, ID uuid.UUID, roles []models.Role) (*models.User, error)
	GetPaginatedUsersByRole(ctx context.Context, role models.Role, pagination *models.UserPagination) (*models.PaginatedResponse[models.User], error)
	UpdateStatus(ctx context.Context, ID uuid.UUID, status models.Status) error
	DeleteUserByID(ctx context.Context, ID uuid.UUID) error
	UpdateUser(ctx context.Context, user models.User) error
}

type userRepository struct {
	di *internal.Di
	DB *gorm.DB
}

func NewUserRepository(di *internal.Di) (UserRepository, error) {
	db, err := internal.Invoke[*gorm.DB](di)
	if err != nil {
		return nil, err
	}

	return &userRepository{
		di: di,
		DB: db,
	}, nil
}

func (u *userRepository) CreateUser(ctx context.Context, user models.User) error {
	if err := u.DB.WithContext(ctx).Create(&user).Error; err != nil {
		return err
	}

	return nil
}

func (u *userRepository) GetUserByEmail(ctx context.Context, email string, roles []models.Role) (*models.User, error) {
	var user *models.User
	query := u.DB.WithContext(ctx).Where("email = ?", email)
	if roles != nil {
		query = query.Where("role IN ?", roles)
	}

	if err := query.First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return user, nil
}

func (u *userRepository) GetUserByID(ctx context.Context, ID uuid.UUID, roles []models.Role) (*models.User, error) {
	var user *models.User
	query := u.DB.WithContext(ctx).Where("Id = ?", ID)
	if roles != nil {
		query = query.Where("Role IN ?", roles)
	}

	if err := query.First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return user, nil
}

func (u *userRepository) GetPaginatedUsersByRole(ctx context.Context, role models.Role, pagination *models.UserPagination) (*models.PaginatedResponse[models.User], error) {
	query := u.DB.WithContext(ctx).
		Where("Users.Role = ?", role).
		Model(&models.User{})

	if pagination.FullName != nil {
		query = query.Where("Users.FullName LIKE ?", fmt.Sprintf("%%%s%%", *pagination.FullName))
	}

	if pagination.Status != nil {
		query = query.Where("Users.Status = ?", *pagination.Status)
	}

	users, err := paginate[models.User](query, &pagination.Pagination, &models.User{})
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	return users, nil
}

func (u *userRepository) UpdateStatus(ctx context.Context, ID uuid.UUID, status models.Status) error {
	if err := u.DB.
		WithContext(ctx).
		Model(&models.User{}).
		Where("Id = ?", ID).
		UpdateColumn("Status", status).Error; err != nil {
		return err
	}

	return nil
}

func (u *userRepository) DeleteUserByID(ctx context.Context, ID uuid.UUID) error {
	if err := u.DB.
		WithContext(ctx).
		Where("ID = ?", ID).
		Delete(&models.User{}).Error; err != nil {
		return err
	}

	return nil
}

func (u *userRepository) UpdateUser(ctx context.Context, user models.User) error {
	if err := u.DB.WithContext(ctx).Model(&models.User{}).Where("ID = ?", user.ID).Updates(user).Error; err != nil {
		return err
	}

	return nil
}
