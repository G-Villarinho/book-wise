package models

import "errors"

var (
	ErrCategoriesNotFound = errors.New("categories not found in database")
)

type Category struct {
	BaseModel
	Name           string `gorm:"column:Name;type:varchar(255);not null"`
	NormalizedName string `gorm:"column:NormalizedName;type:varchar(255);not null;unique"`
	Books          []Book `gorm:"many2many:BookCategories;"`
}

func (c *Category) TableName() string {
	return "Categories"
}
