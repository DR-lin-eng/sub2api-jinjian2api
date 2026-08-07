package service

import (
	"encoding/json"
	"fmt"
	"strconv"
)

func writeProductSystemSettingUpdates(updates map[string]string, settings *SystemSettings) error {
	updates[SettingKeySiteName] = settings.SiteName
	updates[SettingKeySiteLogo] = settings.SiteLogo
	updates[SettingKeyAPIBaseURL] = settings.APIBaseURL
	updates[SettingKeyDocURL] = settings.DocURL
	updates[SettingKeyHideCcsImportButton] = strconv.FormatBool(settings.HideCcsImportButton)
	tableDefaultPageSize, tablePageSizeOptions := normalizeTablePreferences(
		settings.TableDefaultPageSize,
		settings.TablePageSizeOptions,
	)
	updates[SettingKeyTableDefaultPageSize] = strconv.Itoa(tableDefaultPageSize)
	tablePageSizeOptionsJSON, err := json.Marshal(tablePageSizeOptions)
	if err != nil {
		return fmt.Errorf("marshal table page size options: %w", err)
	}
	updates[SettingKeyTablePageSizeOptions] = string(tablePageSizeOptionsJSON)
	updates[SettingKeyCustomEndpoints] = settings.CustomEndpoints

	return nil
}

func writeFeatureSystemSettingUpdates(updates map[string]string, settings *SystemSettings) {
	updates[SettingKeyEnableModelFallback] = strconv.FormatBool(settings.EnableModelFallback)
	updates[SettingKeyFallbackModelAnthropic] = settings.FallbackModelAnthropic
	updates[SettingKeyFallbackModelOpenAI] = settings.FallbackModelOpenAI
	updates[SettingKeyFallbackModelGemini] = settings.FallbackModelGemini
	updates[SettingKeyFallbackModelAntigravity] = settings.FallbackModelAntigravity

	updates[SettingKeyEnableIdentityPatch] = strconv.FormatBool(settings.EnableIdentityPatch)
	updates[SettingKeyIdentityPatchPrompt] = settings.IdentityPatchPrompt

	updates[SettingKeyOpsMonitoringEnabled] = strconv.FormatBool(settings.OpsMonitoringEnabled)
	updates[SettingKeyOpsRealtimeMonitoringEnabled] = strconv.FormatBool(settings.OpsRealtimeMonitoringEnabled)
	updates[SettingKeyOpsQueryModeDefault] = string(ParseOpsQueryMode(settings.OpsQueryModeDefault))
	if settings.OpsMetricsIntervalSeconds > 0 {
		updates[SettingKeyOpsMetricsIntervalSeconds] = strconv.Itoa(settings.OpsMetricsIntervalSeconds)
	}

	updates[SettingKeyChannelMonitorEnabled] = strconv.FormatBool(settings.ChannelMonitorEnabled)
	if v := clampChannelMonitorInterval(settings.ChannelMonitorDefaultIntervalSeconds); v > 0 {
		updates[SettingKeyChannelMonitorDefaultIntervalSeconds] = strconv.Itoa(v)
	}
	updates[SettingKeyRiskControlEnabled] = strconv.FormatBool(settings.RiskControlEnabled)
	updates[SettingKeyCyberSessionBlockEnabled] = strconv.FormatBool(settings.CyberSessionBlockEnabled)
	if settings.CyberSessionBlockTTLSeconds > 0 {
		updates[SettingKeyCyberSessionBlockTTLSeconds] = strconv.Itoa(settings.CyberSessionBlockTTLSeconds)
	}
	updates[SettingKeyMinClaudeCodeVersion] = settings.MinClaudeCodeVersion
	updates[SettingKeyMaxClaudeCodeVersion] = settings.MaxClaudeCodeVersion
}
