package service

import (
	"encoding/json"
	"fmt"
	"strconv"
)

func writeNotificationSystemSettingUpdates(updates map[string]string, settings *SystemSettings) error {
	updates[SettingKeyBalanceLowNotifyEnabled] = strconv.FormatBool(settings.BalanceLowNotifyEnabled)
	updates[SettingKeyBalanceLowNotifyThreshold] = strconv.FormatFloat(settings.BalanceLowNotifyThreshold, 'f', 8, 64)
	updates[SettingKeyBalanceLowNotifyRechargeURL] = settings.BalanceLowNotifyRechargeURL
	updates[SettingKeySubscriptionExpiryNotifyEnabled] = strconv.FormatBool(settings.SubscriptionExpiryNotifyEnabled)
	updates[SettingKeyAccountQuotaNotifyEnabled] = strconv.FormatBool(settings.AccountQuotaNotifyEnabled)
	updates[SettingKeyAccountQuotaNotifyEmails] = MarshalNotifyEmails(settings.AccountQuotaNotifyEmails)

	// A non-nil map keeps the existing whole-replacement semantics.
	if settings.DefaultPlatformQuotas != nil {
		if err := validateDefaultPlatformQuotaMap(settings.DefaultPlatformQuotas); err != nil {
			return err
		}
		blob, err := json.Marshal(settings.DefaultPlatformQuotas)
		if err != nil {
			return fmt.Errorf("marshal default platform quotas: %w", err)
		}
		updates[SettingKeyDefaultPlatformQuotas] = string(blob)
	}

	updates[SettingKeyAllowUserViewErrorRequests] = strconv.FormatBool(settings.AllowUserViewErrorRequests)
	updates[SettingKeyAllowUserViewUsageDetails] = strconv.FormatBool(settings.AllowUserViewUsageDetails)
	return nil
}
