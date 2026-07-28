package service

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
)

func writeRegistrationSystemSettingUpdates(updates map[string]string, settings *SystemSettings) error {
	updates[SettingKeyRegistrationEnabled] = strconv.FormatBool(settings.RegistrationEnabled)
	updates[SettingKeyEmailVerifyEnabled] = strconv.FormatBool(settings.EmailVerifyEnabled)
	registrationEmailSuffixWhitelistJSON, err := json.Marshal(settings.RegistrationEmailSuffixWhitelist)
	if err != nil {
		return fmt.Errorf("marshal registration email suffix whitelist: %w", err)
	}
	updates[SettingKeyRegistrationEmailSuffixWhitelist] = string(registrationEmailSuffixWhitelistJSON)
	updates[SettingKeyPromoCodeEnabled] = strconv.FormatBool(settings.PromoCodeEnabled)
	updates[SettingKeyPasswordResetEnabled] = strconv.FormatBool(settings.PasswordResetEnabled)
	updates[SettingKeyFrontendURL] = settings.FrontendURL
	updates[SettingKeyInvitationCodeEnabled] = strconv.FormatBool(settings.InvitationCodeEnabled)
	updates[SettingKeyTotpEnabled] = strconv.FormatBool(settings.TotpEnabled)
	updates[SettingKeySessionBindingEnabled] = strconv.FormatBool(settings.SessionBindingEnabled)
	updates[SettingKeyStepUpEnabled] = strconv.FormatBool(settings.StepUpEnabled)
	updates[SettingKeyAuditLogRetentionDays] = strconv.Itoa(settings.AuditLogRetentionDays)
	settings.LoginAgreementMode = normalizeLoginAgreementMode(settings.LoginAgreementMode)
	settings.LoginAgreementUpdatedAt = strings.TrimSpace(settings.LoginAgreementUpdatedAt)
	if settings.LoginAgreementUpdatedAt == "" {
		settings.LoginAgreementUpdatedAt = defaultLoginAgreementDate
	}
	loginAgreementDocumentsJSON, err := marshalLoginAgreementDocuments(settings.LoginAgreementDocuments)
	if err != nil {
		return err
	}
	updates[SettingKeyLoginAgreementEnabled] = strconv.FormatBool(settings.LoginAgreementEnabled)
	updates[SettingKeyLoginAgreementMode] = settings.LoginAgreementMode
	updates[SettingKeyLoginAgreementUpdatedAt] = settings.LoginAgreementUpdatedAt
	updates[SettingKeyLoginAgreementDocuments] = loginAgreementDocumentsJSON
	return nil
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

	updates[SettingKeyTurnstileEnabled] = strconv.FormatBool(settings.TurnstileEnabled)
	updates[SettingKeyTurnstileSiteKey] = settings.TurnstileSiteKey
	if settings.TurnstileSecretKey != "" {
		updates[SettingKeyTurnstileSecretKey] = settings.TurnstileSecretKey
	}
	updates[SettingKeyRecaptchaEnabled] = strconv.FormatBool(settings.RecaptchaEnabled)
	updates[SettingKeyRecaptchaSiteKey] = settings.RecaptchaSiteKey
	if settings.RecaptchaSecretKey != "" {
		updates[SettingKeyRecaptchaSecretKey] = settings.RecaptchaSecretKey
	}
	updates[SettingKeyCapEnabled] = strconv.FormatBool(settings.CapEnabled)
	updates[SettingKeyCapAPIEndpoint] = strings.TrimRight(strings.TrimSpace(settings.CapAPIEndpoint), "/")
	if settings.CapSecretKey != "" {
		updates[SettingKeyCapSecretKey] = settings.CapSecretKey
	}
	updates[SettingKeyLocalCaptchaEnabled] = strconv.FormatBool(settings.LocalCaptchaEnabled)
	updates[SettingKeyAPIKeyACLTrustForwardedIP] = strconv.FormatBool(settings.APIKeyACLTrustForwardedIP)
	updates[SettingKeyClientIPResolutionMode] = settings.ClientIPResolutionMode
	updates[SettingKeyClientIPTrustedProxies] = clientIPTrustedProxiesJSON
}
