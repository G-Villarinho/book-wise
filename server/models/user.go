package models

import (
	"database/sql"
	"errors"
	"strings"
	"time"

	"github.com/G-Villarinho/book-wise-api/utils"
	"github.com/google/uuid"
)

var (
	ErrUserNotFound          = errors.New("user not found in the database")
	ErrEmailAlreadyExists    = errors.New("email already exists in the database")
	ErrUserNotFoundInContext = errors.New("user not found in the context")
	ErrUserBlocked           = errors.New("user is blocked")
)

type Status string
type Role string

const (
	Active  Status = "active"
	Blocked Status = "blocked"
)

const (
	Owner  Role = "owner"
	Member Role = "member"
	Admin  Role = "admin"
)

type User struct {
	BaseModel
	FullName string         `gorm:"column:FullName;type:varchar(255);not null"`
	Email    string         `gorm:"column:Email;type:varchar(255);not null;unique"`
	Status   Status         `gorm:"column:Status;type:enum('active', 'blocked');not null;default:'active'"`
	Role     Role           `gorm:"column:Role;type:enum('member', 'admin', 'owner');not null;default:'member';index"`
	Avatar   sql.NullString `gorm:"column:Avatar;type:varchar(255)"`
}

func (u *User) TableName() string {
	return "Users"
}

type UserPagination struct {
	Pagination
	FullName *string `json:"fullName"`
	Email    *string `json:"email"`
	Status   *string `json:"status"`
}

type CreateUserPayload struct {
	FullName string `json:"fullName" validate:"required,max=255"`
	Email    string `json:"email" validate:"required,email,max=255"`
}

type UserResponse struct {
	ID       string `json:"id"`
	FullName string `json:"fullName"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	Avatar   string `json:"avatar,omitempty"`
}

type AdminDetailsResponse struct {
	ID        string    `json:"id"`
	FullName  string    `json:"fullName"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	Status    string    `json:"status"`
	Avatar    string    `json:"avatar,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
}

func (cup *CreateUserPayload) ToUser(role Role) *User {
	ID, _ := uuid.NewV7()

	return &User{
		BaseModel: BaseModel{
			ID: ID,
		},
		FullName: cup.FullName,
		Email:    cup.Email,
		Role:     role,
	}
}

func (u *User) ToUserResponse() *UserResponse {
	return &UserResponse{
		ID:       u.ID.String(),
		FullName: u.FullName,
		Email:    u.Email,
		Role:     string(u.Role),
		Avatar:   u.Avatar.String,
	}
}

func (u *User) ToAdminDetailsResponse() *AdminDetailsResponse {
	return &AdminDetailsResponse{
		ID:        u.ID.String(),
		FullName:  u.FullName,
		Email:     u.Email,
		Role:      string(u.Role),
		Status:    string(u.Status),
		Avatar:    u.Avatar.String,
		CreatedAt: u.CreatedAt,
	}
}

func NewUserPagination(page, limit, sort, title, email, status string) (*UserPagination, error) {
	pagination, err := NewPagination(page, limit, sort)
	if err != nil {
		return nil, err
	}

	bookPagination := &UserPagination{
		Pagination: *pagination,
		FullName:   utils.GetQueryStringPointer(title),
		Email:      utils.GetQueryStringPointer(email),
	}

	if strings.ToLower(status) == "all" {
		bookPagination.Status = nil
	} else {
		bookPagination.Status = utils.GetQueryStringPointer(status)
	}

	return bookPagination, nil
}
