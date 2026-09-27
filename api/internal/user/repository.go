package user

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *repository {
	return &repository{
		db: db,
	}
}

func (repo *repository) FindByID(ctx context.Context, id uuid.UUID) (*User, error) {
	var result User

	if err := repo.db.WithContext(ctx).First(&result, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}

		return nil, err
	}

	return &result, nil
}

func (repo *repository) FindByUID(ctx context.Context, uid string) (*User, error) {
	var result User

	if err := repo.db.WithContext(ctx).First(&result, "uid = ?", uid).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}

		return nil, err
	}

	return &result, nil
}

func (repo *repository) Create(ctx context.Context, user User) error {
	return repo.db.WithContext(ctx).Create(&user).Error
}

func (repo *repository) Update(ctx context.Context, user User) error {
	return repo.db.WithContext(ctx).Save(&user).Error
}

func (repo *repository) ResolveID(ctx context.Context, uid string) (uuid.UUID, error) {
	user, err := repo.FindByUID(ctx, uid)
	if err != nil {
		return uuid.Nil, fmt.Errorf("find user by uid: %w", err)
	}

	return user.ID, nil
}
