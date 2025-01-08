package models

import "database/sql"

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
