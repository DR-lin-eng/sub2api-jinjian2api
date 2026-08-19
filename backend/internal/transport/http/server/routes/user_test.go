package routes

import (
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/transport/http/handler"
	"github.com/Wei-Shaw/sub2api/internal/transport/http/server/middleware"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func TestRegisterUserRoutes_SingleAdminSurface(t *testing.T) {
	gin.SetMode(gin.TestMode)

	router := gin.New()
	v1 := router.Group("/api/v1")
	RegisterUserRoutes(v1, &handler.Handlers{
		User:    &handler.UserHandler{},
		APIKey:  &handler.APIKeyHandler{},
		Usage:   &handler.UsageHandler{},
		Totp:    &handler.TotpHandler{},
		Passkey: &handler.PasskeyHandler{},
	}, middleware.JWTAuthMiddleware(func(c *gin.Context) {
		c.Next()
	}), nil, nil)

	paths := make(map[string]struct{})
	for _, route := range router.Routes() {
		paths[route.Method+" "+route.Path] = struct{}{}
	}

	for _, route := range []string{
		"GET /api/v1/user/profile",
		"PUT /api/v1/user/password",
		"GET /api/v1/keys",
		"POST /api/v1/keys",
		"GET /api/v1/usage",
		"GET /api/v1/user/totp/status",
		"GET /api/v1/user/passkeys",
	} {
		require.Contains(t, paths, route)
	}

	for _, removed := range []string{
		"GET /api/v1/subscriptions/progress",
		"POST /api/v1/redeem",
		"GET /api/v1/announcements",
		"GET /api/v1/available-channels",
	} {
		require.NotContains(t, paths, removed)
	}
}
