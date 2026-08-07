//go:build unit

package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	servermiddleware "github.com/Wei-Shaw/sub2api/internal/transport/http/server/middleware"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

type userHandlerRepoStub struct {
	service.UserRepository
	user *service.User
}

func (s *userHandlerRepoStub) GetByID(context.Context, int64) (*service.User, error) {
	clone := *s.user
	return &clone, nil
}

func (s *userHandlerRepoStub) Update(_ context.Context, user *service.User, _ service.UserUpdateFields) error {
	clone := *user
	s.user = &clone
	return nil
}

func (s *userHandlerRepoStub) GetUserAvatar(context.Context, int64) (*service.UserAvatar, error) {
	if s.user == nil || s.user.AvatarURL == "" {
		return nil, nil
	}
	return &service.UserAvatar{StorageProvider: s.user.AvatarSource, URL: s.user.AvatarURL}, nil
}

func (s *userHandlerRepoStub) UpsertUserAvatar(_ context.Context, _ int64, input service.UpsertUserAvatarInput) (*service.UserAvatar, error) {
	s.user.AvatarURL = input.URL
	s.user.AvatarSource = input.StorageProvider
	return &service.UserAvatar{StorageProvider: input.StorageProvider, URL: input.URL}, nil
}

func (s *userHandlerRepoStub) DeleteUserAvatar(context.Context, int64) error {
	s.user.AvatarURL = ""
	s.user.AvatarSource = ""
	return nil
}

func TestUserHandlerUpdateProfileReturnsAdminProfile(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &userHandlerRepoStub{user: &service.User{
		ID: 11, Email: "admin@example.com", Username: "admin",
		Role: service.RoleAdmin, Status: service.StatusActive,
	}}
	h := NewUserHandler(service.NewUserService(repo))
	recorder := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(recorder)
	c.Request = httptest.NewRequest(http.MethodPut, "/api/v1/user", bytes.NewBufferString(
		`{"username":"local-admin","avatar_url":"https://cdn.example.com/admin.png"}`,
	))
	c.Request.Header.Set("Content-Type", "application/json")
	c.Set(string(servermiddleware.ContextKeyUser), servermiddleware.AuthSubject{UserID: 11})

	h.UpdateProfile(c)

	require.Equal(t, http.StatusOK, recorder.Code)
	var resp struct {
		Code int `json:"code"`
		Data struct {
			Username  string `json:"username"`
			AvatarURL string `json:"avatar_url"`
			Role      string `json:"role"`
		} `json:"data"`
	}
	require.NoError(t, json.Unmarshal(recorder.Body.Bytes(), &resp))
	require.Equal(t, "local-admin", resp.Data.Username)
	require.Equal(t, "https://cdn.example.com/admin.png", resp.Data.AvatarURL)
	require.Equal(t, service.RoleAdmin, resp.Data.Role)
}

func TestUserHandlerGetProfileRequiresAuthentication(t *testing.T) {
	h := NewUserHandler(nil)
	recorder := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(recorder)
	c.Request = httptest.NewRequest(http.MethodGet, "/api/v1/user/profile", nil)

	h.GetProfile(c)

	require.Equal(t, http.StatusUnauthorized, recorder.Code)
}
