package user

import (
	"tabletime/internal/convutil"
)

type CreateUserRequest struct {
	Name  *string `json:"name" example:"สมชาย ใจดี"`
	Email string  `json:"email" binding:"required,email" example:"somchai@tabletime.local"`
}

func (req CreateUserRequest) ToUser() User {
	return User{
		Email: req.Email,
		Name:  req.Name,
	}
}

type UserResponse struct {
	ID       string  `json:"id" example:"3f0c1a7e-2b19-4c5e-9f3a"`
	Name     string  `json:"name,omitempty" example:"สมชาย ใจดี"`
	Email    string  `json:"email" example:"somchai@tabletime.local"`
	ImageURL *string `json:"imageUrl" example:"https://images.example.com/avatar.jpg"`
	Bio      *string `json:"bio" example:"Home cook who loves spicy food."`
}

func NewUserResponse(user User) UserResponse {
	return UserResponse{
		ID:       user.ID.String(),
		Name:     convutil.ToSafeValue(user.Name),
		Email:    user.Email,
		ImageURL: user.ImageURL,
		Bio:      user.Bio,
	}
}

type UpdateUserRequest struct {
	ImageURL *string `json:"imageUrl" binding:"omitempty,url" example:"https://images.example.com/avatar.jpg"`
	Bio      *string `json:"bio" example:"Home cook who loves spicy food."`
}

func (req UpdateUserRequest) ToUser() User {
	return User{
		ImageURL: req.ImageURL,
		Bio:      req.Bio,
	}
}
