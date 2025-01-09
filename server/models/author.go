package models

type Author struct {
	BaseModel
	FullName           string `gorm:"column:FullName;type:varchar(255);not null"`
	NormalizedFullName string `gorm:"column:NormalizedFullName;type:varchar(255);not null;unique"`
	Books              []Book `gorm:"many2many:BookAuthors;"`
}

func (a *Author) TableName() string {
	return "Authors"
}
