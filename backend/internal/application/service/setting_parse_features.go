package service

import (
	"strconv"
	"strings"
)

func (s *SettingService) applyFeatureSettings(result *SystemSettings, settings map[string]string) {
	// Model fallback settings
	result.EnableModelFallback = settings[SettingKeyEnableModelFallback] == "true"
	result.FallbackModelAnthropic = s.getStringOrDefault(settings, SettingKeyFallbackModelAnthropic, "claude-3-5-sonnet-20241022")
	result.FallbackModelOpenAI = s.getStringOrDefault(settings, SettingKeyFallbackModelOpenAI, "gpt-4o")
	result.FallbackModelGemini = s.getStringOrDefault(settings, SettingKeyFallbackModelGemini, "gemini-2.5-pro")
	result.FallbackModelAntigravity = s.getStringOrDefault(settings, SettingKeyFallbackModelAntigravity, "gemini-2.5-pro")

	// Identity patch settings (default: enabled, to preserve existing behavior)
	if v, ok := settings[SettingKeyEnableIdentityPatch]; ok && v != "" {
		result.EnableIdentityPatch = v == "true"
	} else {
		result.EnableIdentityPatch = true
	}
	result.IdentityPatchPrompt = settings[SettingKeyIdentityPatchPrompt]

	// Ops monitoring settings (default: enabled, fail-open)
	result.OpsMonitoringEnabled = !isFalseSettingValue(settings[SettingKeyOpsMonitoringEnabled])
	result.OpsRealtimeMonitoringEnabled = !isFalseSettingValue(settings[SettingKeyOpsRealtimeMonitoringEnabled])
	result.OpsQueryModeDefault = string(ParseOpsQueryMode(settings[SettingKeyOpsQueryModeDefault]))
	result.OpsMetricsIntervalSeconds = 60
	if raw := strings.TrimSpace(settings[SettingKeyOpsMetricsIntervalSeconds]); raw != "" {
		if v, err := strconv.Atoi(raw); err == nil {
			if v < 60 {
				v = 60
			}
			if v > 3600 {
				v = 3600
			}
			result.OpsMetricsIntervalSeconds = v
		}
	}

	// Channel monitor feature (default: enabled, 60s)
	result.ChannelMonitorEnabled = !isFalseSettingValue(settings[SettingKeyChannelMonitorEnabled])
	result.ChannelMonitorDefaultIntervalSeconds = parseChannelMonitorInterval(
		settings[SettingKeyChannelMonitorDefaultIntervalSeconds],
	)

	// Claude Code version check
	result.MinClaudeCodeVersion = settings[SettingKeyMinClaudeCodeVersion]
	result.MaxClaudeCodeVersion = settings[SettingKeyMaxClaudeCodeVersion]

	// 分组隔离
	result.AllowUngroupedKeyScheduling = settings[SettingKeyAllowUngroupedKeyScheduling] == "true"
	result.SchedulerV2Enabled = settings[SettingKeySchedulerV2Enabled] == "true"
	result.SchedulerV2CandidateLimit, result.SchedulerV2ScanLimit = parseSchedulerV2Limits(
		settings[SettingKeySchedulerV2CandidateLimit],
		settings[SettingKeySchedulerV2ScanLimit],
	)
	requestPrioritySettings := parseRequestPriorityAdmissionSettings(settings)
	result.RequestPriorityAdmissionEnabled = requestPrioritySettings.Enabled
	result.RequestPriorityPendingLimitPerInstance = requestPrioritySettings.PendingLimitPerInstance
	result.RequestPriorityPendingMiBPerInstance = requestPrioritySettings.PendingMiBPerInstance
	if result.SchedulerV2Enabled {
		result.SchedulerV2Status = SchedulerEngineStatusBuilding
	} else {
		result.SchedulerV2Status = SchedulerEngineStatusDisabled
	}
}
