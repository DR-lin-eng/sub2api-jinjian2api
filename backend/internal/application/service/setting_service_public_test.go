//go:build unit

package service

import (
	"context"
	"errors"
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	"github.com/stretchr/testify/require"
)

type settingPublicRepoStub struct {
	values map[string]string
	err    error
}

func (s *settingPublicRepoStub) Get(context.Context, string) (*Setting, error) {
	panic("unexpected Get call")
}

func (s *settingPublicRepoStub) GetValue(context.Context, string) (string, error) {
	panic("unexpected GetValue call")
}

func (s *settingPublicRepoStub) Set(context.Context, string, string) error {
	panic("unexpected Set call")
}

func (s *settingPublicRepoStub) GetMultiple(_ context.Context, keys []string) (map[string]string, error) {
	if s.err != nil {
		return nil, s.err
	}
	out := make(map[string]string, len(keys))
	for _, key := range keys {
		if value, ok := s.values[key]; ok {
			out[key] = value
		}
	}
	return out, nil
}

func (s *settingPublicRepoStub) SetMultiple(context.Context, map[string]string) error {
	panic("unexpected SetMultiple call")
}

func (s *settingPublicRepoStub) GetAll(context.Context) (map[string]string, error) {
	panic("unexpected GetAll call")
}

func (s *settingPublicRepoStub) Delete(context.Context, string) error {
	panic("unexpected Delete call")
}

func TestSettingServiceGetPublicSettingsExposesGatewayPresentationSettings(t *testing.T) {
	repo := &settingPublicRepoStub{values: map[string]string{
		SettingKeyTotpEnabled:                          "true",
		SettingKeyPasskeyEnabled:                       "true",
		SettingKeySiteName:                             "Gateway",
		SettingKeySiteLogo:                             "/logo.png",
		SettingKeyAPIBaseURL:                           "https://api.example.com",
		SettingKeyDocURL:                               "https://docs.example.com",
		SettingKeyHideCcsImportButton:                  "true",
		SettingKeyTableDefaultPageSize:                 "50",
		SettingKeyTablePageSizeOptions:                 "[20,50,100]",
		SettingKeyCustomEndpoints:                      `[{"name":"Primary","url":"https://api.example.com"}]`,
		SettingKeyChannelMonitorEnabled:                "false",
		SettingKeyChannelMonitorDefaultIntervalSeconds: "120",
	}}
	cfg := &config.Config{WebAuthn: config.WebAuthnConfig{Enabled: true}}
	svc := NewSettingService(repo, cfg)
	svc.SetVersion("test-version")

	settings, err := svc.GetPublicSettings(context.Background())

	require.NoError(t, err)
	require.True(t, settings.TotpEnabled)
	require.True(t, settings.PasskeyEnabled)
	require.Equal(t, "Gateway", settings.SiteName)
	require.Equal(t, "https://api.example.com", settings.APIBaseURL)
	require.True(t, settings.HideCcsImportButton)
	require.Equal(t, 50, settings.TableDefaultPageSize)
	require.Equal(t, []int{20, 50, 100}, settings.TablePageSizeOptions)
	require.False(t, settings.ChannelMonitorEnabled)
	require.Equal(t, 120, settings.ChannelMonitorDefaultIntervalSeconds)
	require.Equal(t, "test-version", settings.Version)
}

func TestSettingServiceGetPublicSettingsUsesGatewayDefaults(t *testing.T) {
	settings, err := NewSettingService(
		&settingPublicRepoStub{values: map[string]string{}},
		&config.Config{},
	).GetPublicSettings(context.Background())

	require.NoError(t, err)
	require.Equal(t, "Sub2API", settings.SiteName)
	require.False(t, settings.PasskeyEnabled)
	require.True(t, settings.ChannelMonitorEnabled)
	require.Equal(t, channelMonitorIntervalFallback, settings.ChannelMonitorDefaultIntervalSeconds)
}

func TestSettingServiceGetPublicSettingsPropagatesRepositoryFailure(t *testing.T) {
	_, err := NewSettingService(
		&settingPublicRepoStub{err: errors.New("database unavailable")},
		&config.Config{},
	).GetPublicSettings(context.Background())

	require.ErrorContains(t, err, "get public settings")
}
