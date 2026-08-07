package service

func writeNotificationSystemSettingUpdates(updates map[string]string, settings *SystemSettings) error {
	updates[SettingKeyAccountQuotaNotifyEnabled] = boolString(settings.AccountQuotaNotifyEnabled)
	updates[SettingKeyAccountQuotaNotifyEmails] = MarshalNotifyEmails(settings.AccountQuotaNotifyEmails)
	return nil
}

func boolString(value bool) string {
	if value {
		return "true"
	}
	return "false"
}
