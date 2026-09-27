package auth

import "errors"

// Repository (auth_tickets)
var (
	ErrNotFound = errors.New("not found")
)

// Keycloak
var (
	ErrInvalidState        = errors.New("invalid or expired state")
	ErrInvalidTicket       = errors.New("invalid or expired ticket")
	ErrExchangeFailed      = errors.New("exchange code failed")
	ErrLogoutFailed        = errors.New("logout failed")
	ErrInvalidRefreshToken = errors.New("invalid or expired refresh token")
)
