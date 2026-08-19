package admin

import (
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/stretchr/testify/require"
)

func TestDiffSettings_PreservesDomainOrderAndSecretSemantics(t *testing.T) {
	before := &service.SystemSettings{}
	after := &service.SystemSettings{
		SiteName:                             "Sub2API",
		OpsMonitoringEnabled:                 true,
		MinClaudeCodeVersion:                 "1.2.3",
		OpenAILowUpstreamRatePriorityEnabled: true,
		ChannelMonitorEnabled:                true,
	}
	req := UpdateSettingsRequest{
		SMTPPassword: "new-smtp-password",
	}

	changed := diffSettings(before, after, req)

	require.Equal(t, []string{
		"smtp_password",
		"site_name",
		"ops_monitoring_enabled",
		"min_claude_code_version",
		"openai_low_upstream_rate_priority_enabled",
		"channel_monitor_enabled",
	}, changed)
}

func BenchmarkDiffSettings_AllUnchanged(b *testing.B) {
	settings := &service.SystemSettings{}
	req := UpdateSettingsRequest{}

	b.ReportAllocs()
	b.ResetTimer()
	for range b.N {
		_ = diffSettings(settings, settings, req)
	}
}
