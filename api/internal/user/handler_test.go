package user

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"tabletime/internal/reqctx"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

const validUpdateUserJSON = `{"imageUrl":"https://images.example.com/avatar.jpg","bio":"Home cook who loves spicy food."}`

func TestHandlerUpdateUserReturnsUpdatedUser(t *testing.T) {
	service := NewMockService(t)
	userID := uuid.New()
	imageURL := "https://images.example.com/avatar.jpg"
	bio := "Home cook who loves spicy food."
	updated := User{ID: userID, Email: "somchai@tabletime.local", ImageURL: &imageURL, Bio: &bio}

	service.EXPECT().
		Update(mock.Anything, userID, User{ImageURL: &imageURL, Bio: &bio}).
		Return(&updated, nil)

	response := performUpdateUserRequest(t, NewHandler(service), "me", validUpdateUserJSON, userID, true)

	assert.Equal(t, http.StatusOK, response.Code)
	assert.JSONEq(t, `{"id":"`+userID.String()+`","email":"somchai@tabletime.local","imageUrl":"https://images.example.com/avatar.jpg","bio":"Home cook who loves spicy food."}`, response.Body.String())
}

func TestHandlerUpdateUserRejectsNonMeIDWithoutCallingService(t *testing.T) {
	response := performUpdateUserRequest(t, NewHandler(NewMockService(t)), uuid.New().String(), validUpdateUserJSON, uuid.New(), true)

	assertUserErrorMessage(t, response, http.StatusNotFound, "not found")
}

func TestHandlerUpdateUserRejectsMissingAuthenticatedUserWithoutCallingService(t *testing.T) {
	response := performUpdateUserRequest(t, NewHandler(NewMockService(t)), "me", validUpdateUserJSON, uuid.Nil, false)

	assertUserErrorMessage(t, response, http.StatusUnauthorized, "user not found")
}

func TestHandlerUpdateUserRejectsInvalidRequestWithoutCallingService(t *testing.T) {
	response := performUpdateUserRequest(t, NewHandler(NewMockService(t)), "me", `{`, uuid.New(), true)

	assertUserErrorMessage(t, response, http.StatusBadRequest, "invalid request")
}

func TestHandlerUpdateUserRejectsInvalidImageURLWithoutCallingService(t *testing.T) {
	response := performUpdateUserRequest(t, NewHandler(NewMockService(t)), "me", `{"imageUrl":"not-a-url"}`, uuid.New(), true)

	assertUserErrorMessage(t, response, http.StatusBadRequest, "invalid request")
}

func TestHandlerUpdateUserMapsUserNotFoundToNotFoundResponse(t *testing.T) {
	service := NewMockService(t)
	userID := uuid.New()
	service.EXPECT().Update(mock.Anything, userID, mock.Anything).Return(nil, ErrUserNotFound)

	response := performUpdateUserRequest(t, NewHandler(service), "me", validUpdateUserJSON, userID, true)

	assertUserErrorMessage(t, response, http.StatusNotFound, ErrUserNotFound.Error())
}

func TestHandlerUpdateUserMapsUnexpectedErrorToInternalError(t *testing.T) {
	service := NewMockService(t)
	userID := uuid.New()
	expected := errors.New("database unavailable")
	service.EXPECT().Update(mock.Anything, userID, mock.Anything).Return(nil, expected)

	response := performUpdateUserRequest(t, NewHandler(service), "me", validUpdateUserJSON, userID, true)

	assertUserErrorMessage(t, response, http.StatusInternalServerError, expected.Error())
}

func performUpdateUserRequest(t *testing.T, handler *handler, id string, body string, userID uuid.UUID, authenticated bool) *httptest.ResponseRecorder {
	t.Helper()
	gin.SetMode(gin.TestMode)
	response := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(response)
	request := httptest.NewRequest(http.MethodPut, "/users/"+id, bytes.NewBufferString(body))
	request.Header.Set("Content-Type", "application/json")
	if authenticated {
		request = request.WithContext(reqctx.WithUserID(request.Context(), userID))
	}
	ctx.Request = request
	ctx.Params = gin.Params{{Key: "id", Value: id}}
	handler.UpdateUser(ctx)
	return response
}

func assertUserErrorMessage(t *testing.T, response *httptest.ResponseRecorder, status int, message string) {
	t.Helper()
	assert.Equal(t, status, response.Code)
	var body map[string]string
	assert.NoError(t, json.Unmarshal(response.Body.Bytes(), &body))
	assert.Equal(t, message, body["message"])
}
