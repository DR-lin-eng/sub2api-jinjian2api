//go:build unit

package middleware

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync/atomic"
	"testing"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	"github.com/Wei-Shaw/sub2api/internal/shared/ctxkey"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func TestAPIKeyAuthRejectsOversizedCredentialsBeforeLookup(t *testing.T) {
	gin.SetMode(gin.TestMode)
	var calls atomic.Int32
	repo := &stubApiKeyRepo{getByKey: func(context.Context, string) (*service.APIKey, error) {
		calls.Add(1)
		return nil, service.ErrAPIKeyNotFound
	}}
	svc := service.NewAPIKeyService(repo, nil, nil, nil, &config.Config{})

	for _, headers := range []map[string]string{
		{"x-api-key": strings.Repeat("x", service.MaxAPIKeyCredentialBytes+1)},
		{"Authorization": "Bearer " + strings.Repeat("x", service.MaxAPIKeyCredentialBytes+1)},
		{"Authorization": strings.Repeat("x", maxAPIKeyAuthorizationHeaderBytes+1)},
	} {
		router := newLiteAuthTestRouter(svc, &config.Config{})
		w := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/test", nil)
		for name, value := range headers {
			req.Header.Set(name, value)
		}
		router.ServeHTTP(w, req)
		require.Equal(t, http.StatusUnauthorized, w.Code)
	}
	require.Zero(t, calls.Load())
}

func TestAPIKeyAuthRejectsQueryCredentials(t *testing.T) {
	repo := &stubApiKeyRepo{}
	svc := service.NewAPIKeyService(repo, nil, nil, nil, &config.Config{})
	router := newLiteAuthTestRouter(svc, &config.Config{})

	w := httptest.NewRecorder()
	router.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/test?key=secret", nil))

	require.Equal(t, http.StatusBadRequest, w.Code)
	require.Contains(t, w.Body.String(), "api_key_in_query_deprecated")
}

func TestAPIKeyAuthSetsSingleAdminContextAndTouchesLastUsed(t *testing.T) {
	group := activeTestGroup()
	user := activeAdminUser()
	key := &service.APIKey{
		ID: 101, UserID: user.ID, Key: "admin-owned-key", Status: service.StatusActive,
		User: user, GroupID: &group.ID, Group: group,
	}
	var touchCalls atomic.Int32
	repo := &stubApiKeyRepo{
		getByKey: func(_ context.Context, raw string) (*service.APIKey, error) {
			if raw != key.Key {
				return nil, service.ErrAPIKeyNotFound
			}
			clone := *key
			return &clone, nil
		},
		updateLastUsed: func(context.Context, int64, time.Time) error {
			touchCalls.Add(1)
			return nil
		},
	}
	svc := service.NewAPIKeyService(repo, nil, nil, nil, &config.Config{})
	router := gin.New()
	router.Use(gin.HandlerFunc(NewAPIKeyAuthMiddleware(svc, &config.Config{})))
	router.GET("/test", func(c *gin.Context) {
		stored, ok := GetAPIKeyFromContext(c)
		require.True(t, ok)
		require.Equal(t, key.ID, stored.ID)
		require.Equal(t, user.ID, c.Request.Context().Value(ctxkey.UserID))
		storedGroup, ok := c.Request.Context().Value(ctxkey.Group).(*service.Group)
		require.True(t, ok)
		require.Equal(t, group.ID, storedGroup.ID)
		c.Status(http.StatusNoContent)
	})

	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/test", nil)
	req.Header.Set("Authorization", "bearer "+key.Key)
	router.ServeHTTP(w, req)

	require.Equal(t, http.StatusNoContent, w.Code)
	require.Equal(t, int32(1), touchCalls.Load())
}

func TestAPIKeyAuthDoesNotEnforceRemovedDownstreamBilling(t *testing.T) {
	group := activeTestGroup()
	user := activeAdminUser()
	key := &service.APIKey{
		ID: 102, UserID: user.ID, Key: "no-downstream-billing", Status: service.StatusActive,
		User: user, GroupID: &group.ID, Group: group,
	}
	repo := &stubApiKeyRepo{getByKey: func(context.Context, string) (*service.APIKey, error) {
		clone := *key
		return &clone, nil
	}}
	svc := service.NewAPIKeyService(repo, nil, nil, nil, &config.Config{})
	router := newLiteAuthTestRouter(svc, &config.Config{})

	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/test", nil)
	req.Header.Set("x-api-key", key.Key)
	router.ServeHTTP(w, req)

	require.Equal(t, http.StatusOK, w.Code)
}

func TestAPIKeyAuthRejectsExplicitlyDisabledKey(t *testing.T) {
	user := activeAdminUser()
	key := &service.APIKey{ID: 103, UserID: user.ID, Key: "disabled", Status: service.StatusDisabled, User: user}
	repo := &stubApiKeyRepo{getByKey: func(context.Context, string) (*service.APIKey, error) {
		clone := *key
		return &clone, nil
	}}
	svc := service.NewAPIKeyService(repo, nil, nil, nil, &config.Config{})
	router := newLiteAuthTestRouter(svc, &config.Config{})

	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/test", nil)
	req.Header.Set("x-api-key", key.Key)
	router.ServeHTTP(w, req)

	require.Equal(t, http.StatusUnauthorized, w.Code)
	require.Contains(t, w.Body.String(), "API_KEY_DISABLED")
}

func TestAPIKeyAuthRejectsUnavailableGroup(t *testing.T) {
	group := activeTestGroup()
	group.Status = service.StatusDisabled
	user := activeAdminUser()
	key := &service.APIKey{
		ID: 104, UserID: user.ID, Key: "disabled-group", Status: service.StatusActive,
		User: user, GroupID: &group.ID, Group: group,
	}
	repo := &stubApiKeyRepo{getByKey: func(context.Context, string) (*service.APIKey, error) {
		clone := *key
		return &clone, nil
	}}
	svc := service.NewAPIKeyService(repo, nil, nil, nil, &config.Config{})
	router := newLiteAuthTestRouter(svc, &config.Config{})

	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/test", nil)
	req.Header.Set("x-api-key", key.Key)
	router.ServeHTTP(w, req)

	require.Equal(t, http.StatusForbidden, w.Code)
	require.Contains(t, w.Body.String(), "GROUP_DISABLED")
}

func TestAPIKeyGroupsMetadataSkipsLastUsedWrite(t *testing.T) {
	group := activeTestGroup()
	user := activeAdminUser()
	key := &service.APIKey{
		ID: 105, UserID: user.ID, Key: "metadata", Status: service.StatusActive,
		User: user, GroupID: &group.ID, Group: group,
	}
	var touchCalls atomic.Int32
	repo := &stubApiKeyRepo{
		getByKey: func(context.Context, string) (*service.APIKey, error) {
			clone := *key
			return &clone, nil
		},
		updateLastUsed: func(context.Context, int64, time.Time) error {
			touchCalls.Add(1)
			return nil
		},
	}
	svc := service.NewAPIKeyService(repo, nil, nil, nil, &config.Config{})
	router := newLiteAuthTestRouter(svc, &config.Config{})

	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/v1/api-key-groups", nil)
	req.Header.Set("x-api-key", key.Key)
	router.ServeHTTP(w, req)

	require.Equal(t, http.StatusOK, w.Code)
	require.Zero(t, touchCalls.Load())
}

func activeAdminUser() *service.User {
	return &service.User{ID: 7, Role: service.RoleAdmin, Status: service.StatusActive, Concurrency: 3}
}

func activeTestGroup() *service.Group {
	return &service.Group{ID: 42, Name: "gateway", Status: service.StatusActive, Hydrated: true, Platform: service.PlatformOpenAI}
}

func newLiteAuthTestRouter(apiKeyService *service.APIKeyService, cfg *config.Config) *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(gin.HandlerFunc(NewAPIKeyAuthMiddleware(apiKeyService, cfg)))
	ok := func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"ok": true}) }
	router.GET("/test", ok)
	router.GET("/v1/api-key-groups", ok)
	return router
}

type stubApiKeyRepo struct {
	service.APIKeyRepository
	getByKey       func(context.Context, string) (*service.APIKey, error)
	updateLastUsed func(context.Context, int64, time.Time) error
}

func (r *stubApiKeyRepo) GetByKey(ctx context.Context, key string) (*service.APIKey, error) {
	if r.getByKey == nil {
		return nil, service.ErrAPIKeyNotFound
	}
	return r.getByKey(ctx, key)
}

func (r *stubApiKeyRepo) GetByKeyForAuth(ctx context.Context, key string) (*service.APIKey, error) {
	return r.GetByKey(ctx, key)
}

func (r *stubApiKeyRepo) UpdateLastUsed(ctx context.Context, id int64, usedAt time.Time) error {
	if r.updateLastUsed == nil {
		return nil
	}
	return r.updateLastUsed(ctx, id, usedAt)
}
