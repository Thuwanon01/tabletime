package database

import (
	"context"
	"database/sql"
	"tabletime/internal/config"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Open(ctx context.Context, dsn string, logCfg config.Logging) (*gorm.DB, *sql.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logCfg.GormLogLevel()),
	})
	if err != nil {
		return nil, nil, err
	}

	sqldb, err := db.DB()
	if err != nil {
		return nil, nil, err
	}

	if err := sqldb.PingContext(ctx); err != nil {
		_ = sqldb.Close()
		return nil, nil, err
	}

	return db, sqldb, nil
}
