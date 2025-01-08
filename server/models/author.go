package models

type Author struct {
	BaseModel
	FullName string `gorm:"column:FullName;type:varchar(255);not null"`
	Books    []Book `gorm:"many2many:BookAuthors;"`
}

func (a *Author) TableName() string {
	return "Authors"
}
