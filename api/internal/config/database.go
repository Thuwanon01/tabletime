package config

import (
	"errors"
	"fmt"
	"net/url"
	"strings"
)

type Database struct {
	PostgresDSN string `env:"POSTGRES_DSN" validate:"required"`
}

func (database Database) Validate() error {
	if err := validate.Struct(database); err != nil {
		return err
	}

	uri, err := url.Parse(database.PostgresDSN)
	if err != nil {
		return fmt.Errorf("POSTGRES_DSN: %w", err)
	}

	// Path parameter ไม่มีค่าและ query parameter ใน database key ก็ไม่มีค่า
	if strings.Trim(uri.Path, "/") == "" && uri.Query().Get("database") == "" {
		return errors.New("POSTGRES_DSN: ไม่มีชื่อ database")
	}

	return nil
}
