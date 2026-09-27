package user

import (
	"context"
	"errors"
	"net/http"
	"tabletime/internal/httputil"
	"tabletime/internal/reqctx"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Service interface {
	FindByID(ctx context.Context, uid uuid.UUID) (*User, error)
	Update(ctx context.Context, uid uuid.UUID, user User) (*User, error)
}

type handler struct {
	service Service
}

func NewHandler(service Service) *handler {
	return &handler{
		service: service,
	}
}

// GetUser godoc
//
//	@Summary		ดึงข้อมูลจาก user แบบรายคน
//	@Description	ค้นหาข้อมูล User จาก UUID แล้วคืนข้อมูล User ที่เจอกลับมา
//	@Tags			users
//	@Security		BearerAuth
//	@Produce		json
//	@Param			id	path		string	true	"User ID"
//	@Success		200	{object}	user.UserResponse
//	@Failure		400	{object}	httputil.ErrorResponse
//	@Failure		404	{object}	httputil.ErrorResponse
//	@Failure		500	{object}	httputil.ErrorResponse
//	@Router			/users/{id} [get]
func (hdr *handler) GetUser(ctx *gin.Context) {
	id := ctx.Param("id")
	if id != "me" {
		ctx.AbortWithStatusJSON(http.StatusNotFound, httputil.ErrorResponse{Message: "not found"})
		return
	}

	uid, ok := reqctx.UserID(ctx.Request.Context())
	if !ok {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, httputil.ErrorResponse{Message: "user not found"})
		return
	}

	user, err := hdr.service.FindByID(ctx, uid)
	if err != nil {
		switch {
		case errors.Is(err, ErrUserNotFound):
			ctx.JSON(http.StatusNotFound, httputil.ErrorResponse{Message: err.Error()})

		case errors.Is(err, ErrInvalidInput):
			ctx.JSON(http.StatusBadRequest, httputil.ErrorResponse{Message: err.Error()})

		default:
			ctx.JSON(http.StatusInternalServerError, httputil.ErrorResponse{Message: err.Error()})

		}

		return
	}

	ctx.JSON(http.StatusOK, NewUserResponse(*user))
}

// UpdateUser godoc
//
//	@Summary		แก้ไขข้อมูลโปรไฟล์ผู้ใช้
//	@Description	แก้ไข imageUrl และ bio ของผู้ใช้ที่กำลังเข้าสู่ระบบ (name และ email มาจาก Keycloak แก้ไขผ่าน API นี้ไม่ได้)
//	@Tags			users
//	@Security		BearerAuth
//	@Accept			json
//	@Produce		json
//	@Param			id		path		string					true	"User ID"
//	@Param			request	body		user.UpdateUserRequest	true	"Updated profile"
//	@Success		200		{object}	user.UserResponse
//	@Failure		400		{object}	httputil.ErrorResponse
//	@Failure		401		{object}	httputil.ErrorResponse
//	@Failure		404		{object}	httputil.ErrorResponse
//	@Failure		500		{object}	httputil.ErrorResponse
//	@Router			/users/{id} [put]
func (hdr *handler) UpdateUser(ctx *gin.Context) {
	id := ctx.Param("id")
	if id != "me" {
		ctx.AbortWithStatusJSON(http.StatusNotFound, httputil.ErrorResponse{Message: "not found"})
		return
	}

	uid, ok := reqctx.UserID(ctx.Request.Context())
	if !ok {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, httputil.ErrorResponse{Message: "user not found"})
		return
	}

	var req UpdateUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, httputil.ErrorResponse{Message: "invalid request"})
		return
	}

	user, err := hdr.service.Update(ctx.Request.Context(), uid, req.ToUser())
	if err != nil {
		switch {
		case errors.Is(err, ErrUserNotFound):
			ctx.JSON(http.StatusNotFound, httputil.ErrorResponse{Message: err.Error()})

		case errors.Is(err, ErrInvalidInput):
			ctx.JSON(http.StatusBadRequest, httputil.ErrorResponse{Message: err.Error()})

		default:
			ctx.JSON(http.StatusInternalServerError, httputil.ErrorResponse{Message: err.Error()})

		}

		return
	}

	ctx.JSON(http.StatusOK, NewUserResponse(*user))
}
