package models

import (
	"database/sql"
	"errors"

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
	Member Role = "member"
	Admin  Role = "admin"
)

type User struct {
	BaseModel
	FullName string         `gorm:"column:FullName;type:varchar(255);not null"`
	Email    string         `gorm:"column:Email;type:varchar(255);not null;unique"`
	Status   Status         `gorm:"column:Status;type:enum('active', 'blocked');not null;default:'active'"`
	Role     Role           `gorm:"column:Role;type:enum('member', 'admin');not null;default:'member';index"`
	Avatar   sql.NullString `gorm:"column:Avatar;type:varchar(255)"`
}

func (u *User) TableName() string {
	return "Users"
}

type CreateUserPayload struct {
	FullName string `json:"fullName" validate:"required,max=255"`
	Email    string `json:"email" validate:"required,email,max=255"`
}

type UserResponse struct {
	ID       string `json:"id"`
	FullName string `json:"full_name"`
	Email    string `json:"email"`
	Avatar   string `json:"avatar,omitempty"`
}

func (cup *CreateUserPayload) ToUser() *User {
	ID, _ := uuid.NewV7()

	return &User{
		BaseModel: BaseModel{
			ID: ID,
		},
		FullName: cup.FullName,
		Email:    cup.Email,
	}
}
