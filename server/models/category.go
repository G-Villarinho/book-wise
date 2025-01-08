package models

type Category struct {
	BaseModel
	Name  string `gorm:"column:Name;type:varchar(255);not null"`
	Books []Book `gorm:"many2many:BookCategories;"`
}

func (c *Category) TableName() string {
	return "Categories"
}
