package service

import (
	"encoding/json"
	"strconv"
	"strings"

	"github.com/Wei-Shaw/sub2api/internal/shared/ip"
)

func (s *SettingService) parseCoreSystemSettings(settings map[string]string) *SystemSettings {
	clientIPResolutionMode := strings.TrimSpace(settings[SettingKeyClientIPResolutionMode])
	if ip.ValidateResolutionMode(clientIPResolutionMode) != nil {
		clientIPResolutionMode = ip.ResolutionModeAutoCompat
	}
	clientIPTrustedProxies := make([]string, 0)
	if raw := strings.TrimSpace(settings[SettingKeyClientIPTrustedProxies]); raw != "" {
		if err := json.Unmarshal([]byte(raw), &clientIPTrustedProxies); err != nil {
			clientIPTrustedProxies = make([]string, 0)
		}
	}
	result := &SystemSettings{
		FrontendURL:               settings[SettingKeyFrontendURL],
		TotpEnabled:               settings[SettingKeyTotpEnabled] == "true",
		PasskeyEnabled:            s.passkeySettingEnabled(settings),
		SessionBindingEnabled:     settings[SettingKeySessionBindingEnabled] == "true", // 默认关闭
		StepUpEnabled:             settings[SettingKeyStepUpEnabled] == "true",         // 默认关闭
		SMTPHost:                  settings[SettingKeySMTPHost],
		SMTPUsername:              settings[SettingKeySMTPUsername],
		SMTPFrom:                  settings[SettingKeySMTPFrom],
		SMTPFromName:              settings[SettingKeySMTPFromName],
		SMTPUseTLS:                settings[SettingKeySMTPUseTLS] == "true",
		SMTPPasswordConfigured:    settings[SettingKeySMTPPassword] != "",
		APIKeyACLTrustForwardedIP: clientIPResolutionMode != ip.ResolutionModeDirect,
		ClientIPResolutionMode:    clientIPResolutionMode,
		ClientIPTrustedProxies:    clientIPTrustedProxies,
		ClientIPResolutionStatus: ip.ResolutionStatus{
			Mode:                   clientIPResolutionMode,
			CloudflareRangesSource: "embedded",
		},
		SiteName:                     s.getStringOrDefault(settings, SettingKeySiteName, "Sub2API"),
		SiteLogo:                     settings[SettingKeySiteLogo],
		APIBaseURL:                   settings[SettingKeyAPIBaseURL],
		DocURL:                       settings[SettingKeyDocURL],
		HideCcsImportButton:          settings[SettingKeyHideCcsImportButton] == "true",
		CustomEndpoints:              settings[SettingKeyCustomEndpoints],
		StreamModePerformanceEnabled: settings[SettingKeyStreamModePerformanceEnabled] == "true",
	}
	result.TableDefaultPageSize, result.TablePageSizeOptions = parseTablePreferences(
		settings[SettingKeyTableDefaultPageSize],
		settings[SettingKeyTablePageSizeOptions],
	)

	// 解析整数类型
	if port, err := strconv.Atoi(settings[SettingKeySMTPPort]); err == nil {
		result.SMTPPort = port
	} else {
		result.SMTPPort = 587
	}

	// 敏感信息直接返回，方便测试连接时使用
	result.SMTPPassword = settings[SettingKeySMTPPassword]

	return result
}
