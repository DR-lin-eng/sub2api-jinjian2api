package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/transport/http/server/middleware"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func TestUsageReturnsInformationalResponseWithoutBillingState(t *testing.T) {
	gin.SetMode(gin.TestMode)
	recorder := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(recorder)
	c.Request = httptest.NewRequest(http.MethodGet, "/v1/usage", nil)
	c.Set(string(middleware.ContextKeyAPIKey), &service.APIKey{ID: 17, Status: service.StatusAPIKeyActive})
	c.Set(string(middleware.ContextKeyUser), middleware.AuthSubject{UserID: 1})

	(&GatewayHandler{}).Usage(c)

	require.Equal(t, http.StatusOK, recorder.Code)
	var response map[string]any
	require.NoError(t, json.Unmarshal(recorder.Body.Bytes(), &response))
	require.Equal(t, "informational", response["mode"])
	require.Equal(t, true, response["isValid"])
	require.Equal(t, "USD", response["unit"])
	require.NotContains(t, response, "balance")
	require.NotContains(t, response, "remaining")
	require.NotContains(t, response, "subscription")
	require.NotContains(t, response, "quota")
}
