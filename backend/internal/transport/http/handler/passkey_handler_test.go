package handler

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

type passkeySwitchSettingRepo struct {
	value string
	err   error
}

func (r *passkeySwitchSettingRepo) Get(context.Context, string) (*service.Setting, error) {
	return nil, service.ErrSettingNotFound
}
func (r *passkeySwitchSettingRepo) GetValue(context.Context, string) (string, error) {
	return r.value, r.err
}
func (r *passkeySwitchSettingRepo) Set(context.Context, string, string) error { return nil }
func (r *passkeySwitchSettingRepo) GetMultiple(context.Context, []string) (map[string]string, error) {
	return map[string]string{}, r.err
}
func (r *passkeySwitchSettingRepo) SetMultiple(context.Context, map[string]string) error { return nil }
func (r *passkeySwitchSettingRepo) GetAll(context.Context) (map[string]string, error) {
	return map[string]string{}, nil
}
func (r *passkeySwitchSettingRepo) Delete(context.Context, string) error { return nil }

type passkeyBeginSessionStoreStub struct {
	service.PasskeySessionStore
	storeCalls int
}

func (s *passkeyBeginSessionStoreStub) Store(context.Context, *service.PasskeySession, time.Duration) (string, error) {
	s.storeCalls++
	return "passkey-session", nil
}

func TestBindPasskeyFinishRequestRejectsOversizedBody(t *testing.T) {
	gin.SetMode(gin.TestMode)
	recorder := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(recorder)
	c.Request = httptest.NewRequest(
		http.MethodPost,
		"/api/v1/auth/passkey/login/finish",
		strings.NewReader(`{"credential":"`+strings.Repeat("x", passkeyFinishBodyMaxBytes)+`"}`),
	)
	c.Request.Header.Set("Content-Type", "application/json")

	_, ok := bindPasskeyFinishRequest(c)
	require.False(t, ok)
	require.Equal(t, http.StatusBadRequest, recorder.Code)
}

func TestPasskeyBeginLoginRejectsDisabledAdminSwitch(t *testing.T) {
	settings := service.NewSettingService(&passkeySwitchSettingRepo{value: "false"}, &config.Config{
		WebAuthn: config.WebAuthnConfig{Enabled: true},
	})
	h := NewPasskeyHandler(nil, nil, settings)
	recorder := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(recorder)
	c.Request = httptest.NewRequest(http.MethodPost, "/api/v1/auth/passkey/login/begin", nil)

	h.BeginLogin(c)

	require.Equal(t, http.StatusForbidden, recorder.Code)
	require.Contains(t, recorder.Body.String(), "PASSKEY_DISABLED")
}

func TestPasskeyBeginLoginReportsSettingStoreFailure(t *testing.T) {
	settings := service.NewSettingService(
		&passkeySwitchSettingRepo{err: errors.New("database unavailable")},
		&config.Config{WebAuthn: config.WebAuthnConfig{Enabled: true}},
	)
	h := NewPasskeyHandler(nil, nil, settings)
	recorder := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(recorder)
	c.Request = httptest.NewRequest(http.MethodPost, "/api/v1/auth/passkey/login/begin", nil)

	h.BeginLogin(c)

	require.Equal(t, http.StatusInternalServerError, recorder.Code)
	require.NotContains(t, recorder.Body.String(), "PASSKEY_DISABLED")
}

func TestPasskeyBeginLoginStartsCeremonyWithoutSaaSVerification(t *testing.T) {
	cfg := &config.Config{WebAuthn: config.WebAuthnConfig{
		Enabled: true, RPDisplayName: "Sub2API", RPID: "sub2api.example.com",
		RPOrigins: []string{"https://sub2api.example.com"},
	}}
	settings := service.NewSettingService(&passkeySwitchSettingRepo{value: "true"}, cfg)
	sessions := &passkeyBeginSessionStoreStub{}
	passkeys, err := service.NewPasskeyService(cfg, nil, sessions, nil)
	require.NoError(t, err)
	h := NewPasskeyHandler(passkeys, nil, settings)
	recorder := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(recorder)
	c.Request = httptest.NewRequest(http.MethodPost, "/api/v1/auth/passkey/login/begin", nil)

	h.BeginLogin(c)

	require.Equal(t, http.StatusOK, recorder.Code)
	require.Equal(t, 1, sessions.storeCalls)
}

func TestPasskeyCredentialListRequiresAuthentication(t *testing.T) {
	h := NewPasskeyHandler(nil, nil, nil)
	recorder := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(recorder)
	c.Request = httptest.NewRequest(http.MethodGet, "/api/v1/user/passkeys", nil)

	h.List(c)

	require.Equal(t, http.StatusUnauthorized, recorder.Code)
	require.NotContains(t, recorder.Body.String(), "PASSKEY_DISABLED")
}
