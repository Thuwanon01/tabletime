package user

import (
	"context"
	"errors"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestServiceUpdatePersistsProfileFieldsOntoExistingUser(t *testing.T) {
	repo := NewMockRepository(t)
	userID := uuid.New()
	name := "สมชาย ใจดี"
	existing := &User{ID: userID, Email: "somchai@tabletime.local", Name: &name}
	imageURL := "https://images.example.com/avatar.jpg"
	bio := "Home cook who loves spicy food."

	repo.EXPECT().FindByID(mock.Anything, userID).Return(existing, nil)
	repo.EXPECT().Update(mock.Anything, User{ID: userID, Email: "somchai@tabletime.local", Name: &name, ImageURL: &imageURL, Bio: &bio}).Return(nil)

	result, err := NewService(repo).Update(context.Background(), userID, User{ImageURL: &imageURL, Bio: &bio})

	assert.NoError(t, err)
	assert.Equal(t, &imageURL, result.ImageURL)
	assert.Equal(t, &bio, result.Bio)
}

func TestServiceUpdatePropagatesUserNotFound(t *testing.T) {
	repo := NewMockRepository(t)
	userID := uuid.New()
	repo.EXPECT().FindByID(mock.Anything, userID).Return(nil, ErrUserNotFound)

	result, err := NewService(repo).Update(context.Background(), userID, User{})

	assert.Nil(t, result)
	assert.ErrorIs(t, err, ErrUserNotFound)
}

func TestServiceUpdatePropagatesRepositoryUpdateFailure(t *testing.T) {
	repo := NewMockRepository(t)
	userID := uuid.New()
	expected := errors.New("database unavailable")
	repo.EXPECT().FindByID(mock.Anything, userID).Return(&User{ID: userID}, nil)
	repo.EXPECT().Update(mock.Anything, mock.Anything).Return(expected)

	result, err := NewService(repo).Update(context.Background(), userID, User{})

	assert.Nil(t, result)
	assert.ErrorIs(t, err, expected)
}
