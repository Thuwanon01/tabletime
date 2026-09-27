package config

import (
	"log/slog"
	"strings"

	"gorm.io/gorm/logger"
)

type Logging struct {
	Level  string `env:"LOG_LEVEL" envDefault:"DEBUG" validate:"required,oneofci=DEBUG INFO WARN ERROR"`
	Format string `env:"LOG_FORMAT" envDefault:"json" validate:"required,oneofci=json text"`
}

func (logging Logging) SlogLevel() slog.Level {
	var level slog.Level
	if err := level.UnmarshalText([]byte(strings.ToUpper(strings.TrimSpace(logging.Level)))); err != nil {
		// Fallback เป็น info เมื่อ parse ไม่ได้
		return slog.LevelInfo
	}

	return level
}

func (l Logging) GormLogLevel() logger.LogLevel {
	switch l.Level {
	case "DEBUG":
		return logger.Info
	case "WARN":
		return logger.Warn
	case "ERROR":
		return logger.Error
	default:
		return logger.Warn
	}
}

func (logging Logging) Validate() error {
	return validate.Struct(logging)
}
