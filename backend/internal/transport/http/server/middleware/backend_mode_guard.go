package middleware

import (
	"strings"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/shared/response"

	"github.com/gin-gonic/gin"
)

// BackendModeUserGuard keeps the self-service routes admin-only in this distribution.
// It must run after JWT auth so the role is available in context.
func BackendModeUserGuard(_ *service.SettingService) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, _ := GetUserRoleFromContext(c)
		if role == "admin" {
			c.Next()
			return
		}
		response.Forbidden(c, "This distribution only permits the local administrator.")
		c.Abort()
	}
}

func backendModeAllowsAuthPath(path string) bool {
	path = strings.ToLower(strings.TrimSpace(path))
	for _, suffix := range []string{
		"/auth/login",
		"/auth/login/2fa",
		"/auth/passkey/login/begin",
		"/auth/passkey/login/finish",
		"/auth/logout",
		"/auth/refresh",
		"/auth/credential-key",
	} {
		if strings.HasSuffix(path, suffix) {
			return true
		}
	}
	return false
}

// BackendModeAuthGuard exposes only the local administrator session endpoints.
func BackendModeAuthGuard(_ *service.SettingService) gin.HandlerFunc {
	return func(c *gin.Context) {
		if backendModeAllowsAuthPath(c.Request.URL.Path) {
			c.Next()
			return
		}
		response.Forbidden(c, "Registration and self-service authentication are not available in this distribution.")
		c.Abort()
	}
}
