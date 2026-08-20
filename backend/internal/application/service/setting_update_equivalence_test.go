//go:build unit

package service

import (
	"context"
	"strings"
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	infraerrors "github.com/Wei-Shaw/sub2api/internal/shared/errors"
	clientip "github.com/Wei-Shaw/sub2api/internal/shared/ip"
	"github.com/stretchr/testify/require"
)

var benchmarkSystemSettingUpdates map[string]string

func newSystemSettingsUpdateFixture(svc *SettingService) *SystemSettings {
	settings := svc.parseSettings(nil)
	settings.SMTPPassword = " smtp-secret "
	settings.ClientIPResolutionMode = clientip.ResolutionModeTrustedProxy
	settings.ClientIPTrustedProxies = []string{"192.0.2.7", "2001:db8::/32"}
	settings.TableDefaultPageSize = 50
	settings.TablePageSizeOptions = []int{20, 50, 100}
	settings.OpsMetricsIntervalSeconds = 17
	settings.ChannelMonitorDefaultIntervalSeconds = 31
	settings.OpenAIOAuthSchedulingRateMultiplier = 0.25
	settings.OpenAIAdvancedSchedulerLBTopK = " 3 "
	settings.OpenAIAdvancedSchedulerWeightPriority = "2.5"
	settings.OpenAIAdvancedSchedulerWeightLoad = "1"
	settings.ClaudeOAuthSystemPromptBlocks = `[{"type":"text","text":"fixture"}]`
	return settings
}

func TestBuildSystemSettingsUpdatesContainsOnlyGatewaySettings(t *testing.T) {
	svc := NewSettingService(nil, &config.Config{})
	settings := newSystemSettingsUpdateFixture(svc)

	updates, err := svc.buildSystemSettingsUpdates(context.Background(), settings)

	require.NoError(t, err)
	require.Equal(t, "50", updates[SettingKeyTableDefaultPageSize])
	require.Equal(t, "[20,50,100]", updates[SettingKeyTablePageSizeOptions])
	require.Equal(t, "0.25", updates[SettingKeyOpenAIOAuthSchedulingRateMultiplier])
	require.Equal(t, "3", updates[SettingKeyOpenAIAdvancedSchedulerLBTopK])
	require.Equal(t, clientip.ResolutionModeTrustedProxy, settings.ClientIPResolutionMode)
	require.Equal(t, []string{"192.0.2.7/32", "2001:db8::/32"}, settings.ClientIPTrustedProxies)

	for key := range updates {
		lower := strings.ToLower(key)
		require.NotContains(t, lower, "registration")
		require.NotContains(t, lower, "captcha")
		require.NotContains(t, lower, "payment")
		require.NotContains(t, lower, "affiliate")
		require.NotContains(t, lower, "promo")
		require.NotContains(t, lower, "redeem")
	}
}

func TestBuildSystemSettingsUpdatesPreservesSMTPSecretOverwriteSemantics(t *testing.T) {
	svc := NewSettingService(nil, &config.Config{})

	emptyUpdates, err := svc.buildSystemSettingsUpdates(context.Background(), &SystemSettings{})
	require.NoError(t, err)
	require.NotContains(t, emptyUpdates, SettingKeySMTPPassword)

	settings := newSystemSettingsUpdateFixture(svc)
	updates, err := svc.buildSystemSettingsUpdates(context.Background(), settings)
	require.NoError(t, err)
	require.Equal(t, " smtp-secret ", updates[SettingKeySMTPPassword])
}

func TestBuildSystemSettingsUpdatesPreservesGatewayValidationOrder(t *testing.T) {
	tests := []struct {
		name   string
		mutate func(*SystemSettings)
		reason string
	}{
		{
			name: "scheduler limits before oauth multiplier",
			mutate: func(settings *SystemSettings) {
				settings.SchedulerV2CandidateLimit = 10
				settings.SchedulerV2ScanLimit = 1
				settings.OpenAIOAuthSchedulingRateMultiplier = -1
			},
			reason: "INVALID_SCHEDULER_V2_LIMITS",
		},
		{
			name: "oauth multiplier before client ip",
			mutate: func(settings *SystemSettings) {
				settings.OpenAIOAuthSchedulingRateMultiplier = -1
				settings.ClientIPResolutionMode = "invalid"
			},
			reason: "INVALID_OPENAI_OAUTH_SCHEDULING_RATE_MULTIPLIER",
		},
		{
			name: "client ip mode before trusted proxies",
			mutate: func(settings *SystemSettings) {
				settings.ClientIPResolutionMode = "invalid"
				settings.ClientIPTrustedProxies = []string{"invalid"}
			},
			reason: "INVALID_CLIENT_IP_RESOLUTION_MODE",
		},
		{
			name: "trusted proxies before prompt blocks",
			mutate: func(settings *SystemSettings) {
				settings.ClientIPResolutionMode = clientip.ResolutionModeAutoCompat
				settings.ClientIPTrustedProxies = []string{"invalid"}
				settings.ClaudeOAuthSystemPromptBlocks = "{"
			},
			reason: "INVALID_CLIENT_IP_TRUSTED_PROXIES",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			svc := NewSettingService(nil, &config.Config{})
			settings := &SystemSettings{}
			tt.mutate(settings)
			_, err := svc.buildSystemSettingsUpdates(context.Background(), settings)
			require.Error(t, err)
			require.Equal(t, tt.reason, infraerrors.Reason(err))
		})
	}
}

func BenchmarkBuildSystemSettingsUpdates(b *testing.B) {
	svc := NewSettingService(nil, &config.Config{})
	base := newSystemSettingsUpdateFixture(svc)
	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		settings := *base
		updates, err := svc.buildSystemSettingsUpdates(context.Background(), &settings)
		if err != nil {
			b.Fatal(err)
		}
		benchmarkSystemSettingUpdates = updates
	}
}
