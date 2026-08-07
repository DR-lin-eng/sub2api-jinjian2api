package handler

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	middleware2 "github.com/Wei-Shaw/sub2api/internal/transport/http/server/middleware"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

type usageDetailRepoStub struct {
	service.UsageLogRepository
	record *service.UsageLog
	calls  int
}

func (s *usageDetailRepoStub) GetByID(context.Context, int64) (*service.UsageLog, error) {
	s.calls++
	return s.record, nil
}

func newUsageDetailTestRouter(usageRepo *usageDetailRepoStub) *gin.Engine {
	gin.SetMode(gin.TestMode)
	h := NewUsageHandler(service.NewUsageService(usageRepo), nil, nil)
	router := gin.New()
	router.Use(func(c *gin.Context) {
		c.Set(string(middleware2.ContextKeyUser), middleware2.AuthSubject{UserID: 42})
		c.Next()
	})
	router.GET("/usage/:id", h.GetByID)
	return router
}

func TestUsageDetailAccessAllowsAdministratorOwnedRecord(t *testing.T) {
	usageRepo := &usageDetailRepoStub{record: &service.UsageLog{ID: 7, UserID: 42, RequestID: "req_detail"}}
	recorder := httptest.NewRecorder()
	newUsageDetailTestRouter(usageRepo).ServeHTTP(
		recorder,
		httptest.NewRequest(http.MethodGet, "/usage/7", nil),
	)

	require.Equal(t, http.StatusOK, recorder.Code)
	require.Equal(t, 1, usageRepo.calls)
	require.Contains(t, recorder.Body.String(), `"request_id":"req_detail"`)
}

func TestUsageDetailAccessRejectsRecordOwnedByAnotherIdentity(t *testing.T) {
	usageRepo := &usageDetailRepoStub{record: &service.UsageLog{ID: 7, UserID: 99}}
	recorder := httptest.NewRecorder()
	newUsageDetailTestRouter(usageRepo).ServeHTTP(
		recorder,
		httptest.NewRequest(http.MethodGet, "/usage/7", nil),
	)

	require.Equal(t, http.StatusForbidden, recorder.Code)
	require.Equal(t, 1, usageRepo.calls)
}
