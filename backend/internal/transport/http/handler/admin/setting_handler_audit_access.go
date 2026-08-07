package admin

import (
	"slices"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
)

func appendAccessSettingChanges(changed []string, before, after *service.SystemSettings, req *UpdateSettingsRequest) []string {
	if before.FrontendURL != after.FrontendURL {
		changed = append(changed, "frontend_url")
	}
	if before.TotpEnabled != after.TotpEnabled {
		changed = append(changed, "totp_enabled")
	}
	if before.PasskeyEnabled != after.PasskeyEnabled {
		changed = append(changed, "passkey_enabled")
	}
	if before.SessionBindingEnabled != after.SessionBindingEnabled {
		changed = append(changed, "session_binding_enabled")
	}
	if before.StepUpEnabled != after.StepUpEnabled {
		changed = append(changed, "step_up_enabled")
	}
	if before.SMTPHost != after.SMTPHost {
		changed = append(changed, "smtp_host")
	}
	if before.SMTPPort != after.SMTPPort {
		changed = append(changed, "smtp_port")
	}
	if before.SMTPUsername != after.SMTPUsername {
		changed = append(changed, "smtp_username")
	}
	if req.SMTPPassword != "" {
		changed = append(changed, "smtp_password")
	}
	if before.SMTPFrom != after.SMTPFrom {
		changed = append(changed, "smtp_from_email")
	}
	if before.SMTPFromName != after.SMTPFromName {
		changed = append(changed, "smtp_from_name")
	}
	if before.SMTPUseTLS != after.SMTPUseTLS {
		changed = append(changed, "smtp_use_tls")
	}
	if before.ClientIPResolutionMode != after.ClientIPResolutionMode {
		changed = append(changed, "client_ip_resolution_mode")
	}
	if !slices.Equal(before.ClientIPTrustedProxies, after.ClientIPTrustedProxies) {
		changed = append(changed, "client_ip_trusted_proxies")
	}
	return changed
}
