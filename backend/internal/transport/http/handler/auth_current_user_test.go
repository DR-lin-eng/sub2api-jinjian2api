//go:build unit

package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	servermiddleware "github.com/Wei-Shaw/sub2api/internal/transport/http/server/middleware"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func TestAuthHandlerGetCurrentUserReturnsLocalAdmin(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &userHandlerRepoStub{user: &service.User{
		ID: 31, Email: "admin@example.com", Username: "admin",
		Role: service.RoleAdmin, Status: service.StatusActive,
	}}
	h := &AuthHandler{userService: service.NewUserService(repo)}

	recorder := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(recorder)
	c.Request = httptest.NewRequest(http.MethodGet, "/api/v1/auth/me", nil)
	c.Set(string(servermiddleware.ContextKeyUser), servermiddleware.AuthSubject{UserID: 31})
	h.GetCurrentUser(c)

	require.Equal(t, http.StatusOK, recorder.Code)
	var resp struct {
		Code int `json:"code"`
		Data struct {
			ID      int64   `json:"id"`
			Email   string  `json:"email"`
			Role    string  `json:"role"`
			RunMode *string `json:"run_mode"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(recorder.Body.Bytes(), &resp))
	require.Equal(t, 0, resp.Code)
	require.Equal(t, int64(31), resp.Data.ID)
	require.Equal(t, "admin@example.com", resp.Data.Email)
	require.Equal(t, service.RoleAdmin, resp.Data.Role)
	require.Nil(t, resp.Data.RunMode)
}
