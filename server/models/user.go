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
	ErrCannotBlockYourself   = errors.New("block user: the logged-in user's ID was provided as the target")
	ErrCannotUnblockYourself = errors.New("unblock user: the logged-in user's ID was provided as the target")
	ErrUserAlredyBlocked     = errors.New("the provide user`s ID already blocked")
	ErrUserAlreadyActive     = errors.New("the provided user's ID is already active")
	ErrUserAlreadyUnblocked  = errors.New("the provided user's ID is already unblocked")
	ErrCannotDeleteYourself  = errors.New("delete user: the logged-in user's ID was provided as the target")
	ErrSameIDProvided        = errors.New("the logged-in user's ID was provided as the target")
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
	Status   Status         `gorm:"column:Status;type:enum('active', 'blocked');not null;default:'active';index"`
	Role     Role           `gorm:"column:Role;type:enum('member', 'admin', 'owner');not null;default:'member';index"`
	Avatar   sql.NullString `gorm:"column:Avatar;type:varchar(255)"`
}

func (u *User) TableName() string {
	return "Users"
}

type UserPagination struct {
	Pagination
	FullName *string `json:"fullName"`
	Status   *string `json:"status"`
}

type CreateUserPayload struct {
	FullName string `json:"fullName" validate:"required,max=255"`
	Email    string `json:"email" validate:"required,email,max=255"`
}

type UpdateAdminStatusPayload struct {
	AdminID uuid.UUID `json:"adminId" validate:"required"`
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

type AdminBasicInfoResponse struct {
	FullName string `json:"fullName"`
	Email    string `json:"email"`
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

func (u *User) ToAdminBasicInfoResponse() *AdminBasicInfoResponse {
	return &AdminBasicInfoResponse{
		FullName: u.FullName,
		Email:    u.Email,
	}
}

func NewUserPagination(page, limit, sort, fullName, status string) (*UserPagination, error) {
	pagination, err := NewPagination(page, limit, sort)
	if err != nil {
		return nil, err
	}

	bookPagination := &UserPagination{
		Pagination: *pagination,
		FullName:   utils.GetQueryStringPointer(fullName),
	}

	if strings.ToLower(status) == "all" {
		bookPagination.Status = nil
	} else {
		bookPagination.Status = utils.GetQueryStringPointer(status)
	}

	return bookPagination, nil
}
