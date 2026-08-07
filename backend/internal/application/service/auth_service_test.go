package service

import (
	"context"
	"testing"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	"github.com/stretchr/testify/require"
)

func TestRefreshTokenTTLEnforcesSevenDaySessionMinimum(t *testing.T) {
	svc := &AuthService{cfg: &config.Config{JWT: config.JWTConfig{RefreshTokenExpireDays: 1}}}
	require.Equal(t, 7*24*time.Hour, svc.refreshTokenTTL())

	svc.cfg.JWT.RefreshTokenExpireDays = 30
	require.Equal(t, 30*24*time.Hour, svc.refreshTokenTTL())
}

func TestAuthServiceGenerateAndValidateAdministratorToken(t *testing.T) {
	svc := NewAuthService(nil, nil, &config.Config{JWT: config.JWTConfig{
		Secret:                   "test-secret",
		AccessTokenExpireMinutes: 15,
	}}, nil)
	user := &User{
		ID: 7, Email: "admin@example.com", PasswordHash: "password-hash",
		Role: RoleAdmin, Status: StatusActive,
	}

	token, err := svc.GenerateToken(context.Background(), user)
	require.NoError(t, err)
	claims, err := svc.ValidateToken(token)
	require.NoError(t, err)
	require.Equal(t, user.ID, claims.UserID)
	require.Equal(t, RoleAdmin, claims.Role)
	require.NotEmpty(t, claims.SessionID)
	require.Equal(t, 15*60, svc.GetAccessTokenExpiresIn())
}
