package service

import "strconv"

func writeLocalAuthSystemSettingUpdates(updates map[string]string, settings *SystemSettings) {
	updates[SettingKeyFrontendURL] = settings.FrontendURL
	updates[SettingKeyTotpEnabled] = strconv.FormatBool(settings.TotpEnabled)
	updates[SettingKeyPasskeyEnabled] = strconv.FormatBool(settings.PasskeyEnabled)
	updates[SettingKeySessionBindingEnabled] = strconv.FormatBool(settings.SessionBindingEnabled)
	updates[SettingKeyStepUpEnabled] = strconv.FormatBool(settings.StepUpEnabled)
	updates[SettingKeyAuditLogRetentionDays] = strconv.Itoa(settings.AuditLogRetentionDays)
}

func writeAccessSystemSettingUpdates(updates map[string]string, settings *SystemSettings, clientIPTrustedProxiesJSON string) {
	// Only overwrite stored secrets when the request carries a replacement.
	updates[SettingKeySMTPHost] = settings.SMTPHost
	updates[SettingKeySMTPPort] = strconv.Itoa(settings.SMTPPort)
	updates[SettingKeySMTPUsername] = settings.SMTPUsername
	if settings.SMTPPassword != "" {
		updates[SettingKeySMTPPassword] = settings.SMTPPassword
	}
	updates[SettingKeySMTPFrom] = settings.SMTPFrom
	updates[SettingKeySMTPFromName] = settings.SMTPFromName
	updates[SettingKeySMTPUseTLS] = strconv.FormatBool(settings.SMTPUseTLS)

	updates[SettingKeyAPIKeyACLTrustForwardedIP] = strconv.FormatBool(settings.APIKeyACLTrustForwardedIP)
	updates[SettingKeyClientIPResolutionMode] = settings.ClientIPResolutionMode
	updates[SettingKeyClientIPTrustedProxies] = clientIPTrustedProxiesJSON
}
