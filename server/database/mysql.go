package database

import (
	"context"

	"github.com/G-Villarinho/book-wise-api/config"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

func NewMysqlConnection(ctx context.Context) (*gorm.DB, error) {
	db, err := gorm.Open(mysql.Open(config.Env.ConnectionString), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "",   // Sem prefixo
			SingularTable: true, // Evita pluralização automática
			NoLowerCase:   true, // Desativa snake_case
		},
	})
	if err != nil {
		return nil, err
	}

	slqDB, err := db.DB()
	if err != nil {
		return nil, err
	}

	if err := slqDB.PingContext(ctx); err != nil {
		_ = slqDB.Close()
		return nil, err
	}

	return db, nil
}
