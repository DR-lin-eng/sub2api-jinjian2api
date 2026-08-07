package service

import (
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/platform/config"
)

var benchmarkParsedSystemSettings *SystemSettings

func BenchmarkSettingServiceParseSettings(b *testing.B) {
	service := NewSettingService(nil, &config.Config{})
	tests := []struct {
		name     string
		settings map[string]string
	}{
		{name: "defaults", settings: map[string]string{}},
		{name: "persisted", settings: map[string]string{
			SettingKeyClientIPResolutionMode:            "trusted_proxy",
			SettingKeyClientIPTrustedProxies:            `["10.0.0.0/8","2001:db8::/32"]`,
			SettingKeyOpenAIAdvancedSchedulerWeightLoad: "2.5",
			SettingKeyAccountQuotaNotifyEmails:          `[{"email":"ops@example.com"}]`,
		}},
	}

	for _, test := range tests {
		b.Run(test.name, func(b *testing.B) {
			b.ReportAllocs()
			for b.Loop() {
				benchmarkParsedSystemSettings = service.parseSettings(test.settings)
			}
		})
	}
}
