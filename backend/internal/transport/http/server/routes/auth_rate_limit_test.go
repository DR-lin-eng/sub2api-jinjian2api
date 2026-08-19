package routes

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/platform/middleware"
	"github.com/Wei-Shaw/sub2api/internal/transport/http/handler"
	servermiddleware "github.com/Wei-Shaw/sub2api/internal/transport/http/server/middleware"
	"github.com/alicebob/miniredis/v2"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"github.com/stretchr/testify/require"
)

func newAuthRoutesTestRouter(redisClient *redis.Client) *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(middleware.NewCredentialAuthIngressLimiter())

	RegisterAuthRoutes(
		router.Group("/api/v1"),
		&handler.Handlers{
			Auth:    &handler.AuthHandler{},
			Passkey: &handler.PasskeyHandler{},
			Setting: &handler.SettingHandler{},
		},
		servermiddleware.JWTAuthMiddleware(func(c *gin.Context) { c.Next() }),
		redisClient,
		nil,
		nil,
		nil,
	)
	return router
}

func TestAuthRoutesRateLimitFailCloseWhenRedisUnavailable(t *testing.T) {
	rdb := redis.NewClient(&redis.Options{
		Addr: "127.0.0.1:1", DialTimeout: 50 * time.Millisecond,
		ReadTimeout: 50 * time.Millisecond, WriteTimeout: 50 * time.Millisecond,
	})
	t.Cleanup(func() { _ = rdb.Close() })

	router := newAuthRoutesTestRouter(rdb)
	for _, path := range []string{
		"/api/v1/auth/login/2fa",
		"/api/v1/auth/passkey/login/begin",
		"/api/v1/auth/passkey/login/finish",
	} {
		req := httptest.NewRequest(http.MethodPost, path, strings.NewReader(`{}`))
		req.Header.Set("Content-Type", "application/json")
		req.RemoteAddr = "203.0.113.10:12345"
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		require.Equal(t, http.StatusTooManyRequests, w.Code, "path=%s", path)
		require.Contains(t, w.Body.String(), "rate limit exceeded", "path=%s", path)
	}
}

func TestCredentialKeyRouteUsesBoundedLocalLimiterWithoutRedisCounter(t *testing.T) {
	server := miniredis.RunT(t)
	rdb := redis.NewClient(&redis.Options{Addr: server.Addr()})
	t.Cleanup(func() { _ = rdb.Close() })

	router := newAuthRoutesTestRouter(rdb)
	for index := 0; index < 30; index++ {
		req := httptest.NewRequest(http.MethodGet, "/api/v1/auth/credential-key", nil)
		req.RemoteAddr = "203.0.113.20:1234"
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		require.Equal(t, http.StatusOK, w.Code, "request=%d", index+1)
	}

	req := httptest.NewRequest(http.MethodGet, "/api/v1/auth/credential-key", nil)
	req.RemoteAddr = "203.0.113.20:1234"
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	require.Equal(t, http.StatusTooManyRequests, w.Code)
	require.Equal(t, "60", w.Header().Get("Retry-After"))

	for _, key := range server.Keys() {
		require.NotContains(t, key, "rate_limit:auth-credential-key")
	}
}

func TestLoginRequiresBrowserCredentialEnvelope(t *testing.T) {
	server := miniredis.RunT(t)
	rdb := redis.NewClient(&redis.Options{Addr: server.Addr()})
	t.Cleanup(func() { _ = rdb.Close() })

	router := newAuthRoutesTestRouter(rdb)
	req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/login", strings.NewReader(`{"email":"admin@example.com","password":"secret-123"}`))
	req.Header.Set("Content-Type", "application/json")
	req.RemoteAddr = "203.0.113.30:1234"
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	require.Equal(t, http.StatusForbidden, w.Code)
	require.Contains(t, w.Body.String(), "CREDENTIAL_BROWSER_FLOW_REQUIRED")
}

func TestRemovedSelfServiceAuthRoutesAreNotRegistered(t *testing.T) {
	server := miniredis.RunT(t)
	rdb := redis.NewClient(&redis.Options{Addr: server.Addr()})
	t.Cleanup(func() { _ = rdb.Close() })
	router := newAuthRoutesTestRouter(rdb)

	for _, path := range []string{
		"/api/v1/auth/register",
		"/api/v1/auth/send-verify-code",
		"/api/v1/auth/forgot-password",
		"/api/v1/auth/captcha",
		"/api/v1/auth/oauth/linuxdo/start",
	} {
		w := httptest.NewRecorder()
		router.ServeHTTP(w, httptest.NewRequest(http.MethodPost, path, strings.NewReader(`{}`)))
		require.Equal(t, http.StatusNotFound, w.Code, "path=%s", path)
	}
}
