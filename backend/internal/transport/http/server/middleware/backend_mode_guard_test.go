//go:build unit

package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func TestBackendModeUserGuardAlwaysRequiresAdmin(t *testing.T) {
	for _, tc := range []struct {
		name       string
		role       string
		wantStatus int
	}{
		{name: "admin", role: "admin", wantStatus: http.StatusOK},
		{name: "regular user", role: "user", wantStatus: http.StatusForbidden},
		{name: "missing role", wantStatus: http.StatusForbidden},
	} {
		t.Run(tc.name, func(t *testing.T) {
			gin.SetMode(gin.TestMode)
			router := gin.New()
			if tc.role != "" {
				router.Use(func(c *gin.Context) {
					c.Set(string(ContextKeyUserRole), tc.role)
					c.Next()
				})
			}
			router.Use(BackendModeUserGuard(nil))
			router.GET("/test", func(c *gin.Context) { c.Status(http.StatusOK) })

			w := httptest.NewRecorder()
			router.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/test", nil))
			require.Equal(t, tc.wantStatus, w.Code)
		})
	}
}

func TestBackendModeAuthGuardOnlyAllowsLocalSessionEndpoints(t *testing.T) {
	for _, tc := range []struct {
		path       string
		wantStatus int
	}{
		{path: "/api/v1/auth/login", wantStatus: http.StatusOK},
		{path: "/api/v1/auth/login/2fa", wantStatus: http.StatusOK},
		{path: "/api/v1/auth/passkey/login/begin", wantStatus: http.StatusOK},
		{path: "/api/v1/auth/passkey/login/finish", wantStatus: http.StatusOK},
		{path: "/api/v1/auth/logout", wantStatus: http.StatusOK},
		{path: "/api/v1/auth/refresh", wantStatus: http.StatusOK},
		{path: "/api/v1/auth/credential-key", wantStatus: http.StatusOK},
		{path: "/api/v1/auth/register", wantStatus: http.StatusForbidden},
		{path: "/api/v1/auth/forgot-password", wantStatus: http.StatusForbidden},
		{path: "/api/v1/auth/captcha", wantStatus: http.StatusForbidden},
		{path: "/api/v1/auth/oauth/oidc/callback", wantStatus: http.StatusForbidden},
		{path: "/api/v1/auth/oauth/pending/exchange", wantStatus: http.StatusForbidden},
	} {
		t.Run(tc.path, func(t *testing.T) {
			gin.SetMode(gin.TestMode)
			router := gin.New()
			router.Use(BackendModeAuthGuard(nil))
			router.Any("/*path", func(c *gin.Context) { c.Status(http.StatusOK) })

			w := httptest.NewRecorder()
			router.ServeHTTP(w, httptest.NewRequest(http.MethodGet, tc.path, nil))
			require.Equal(t, tc.wantStatus, w.Code)
		})
	}
}
