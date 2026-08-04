package handler

import (
	"context"
	"strings"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
)

func firstHumanVerificationToken(captchaToken, turnstileToken string) string {
	if token := strings.TrimSpace(captchaToken); token != "" {
		return token
	}
	return strings.TrimSpace(turnstileToken)
}

func humanVerificationProof(captchaToken, turnstileToken, tencentTicket, tencentRandstr string) service.HumanVerificationProof {
	return service.HumanVerificationProof{
		Token:          firstHumanVerificationToken(captchaToken, turnstileToken),
		TencentTicket:  strings.TrimSpace(tencentTicket),
		TencentRandstr: strings.TrimSpace(tencentRandstr),
	}
}

// verifyTencentCaptchaForAction keeps old handler test fixtures and partial
// dependency graphs compatible while still failing closed when settings
// explicitly select Tencent Captcha. Production handlers use authService and
// therefore read the provider snapshot exactly once per action.
func verifyTencentCaptchaForAction(
	ctx context.Context,
	authService *service.AuthService,
	settingService *service.SettingService,
	proof service.HumanVerificationProof,
	remoteIP string,
) error {
	if authService != nil {
		return authService.VerifyTencentCaptchaIfEnabled(ctx, proof, remoteIP)
	}
	if settingService == nil {
		return nil
	}

	config, err := settingService.GetHumanVerificationConfig(ctx)
	if err != nil {
		return service.ErrHumanVerificationUnavailable
	}
	switch config.Provider {
	case service.HumanVerificationProviderTencent:
		return service.ErrTencentCaptchaNotConfigured
	case service.HumanVerificationProviderInvalid:
		return service.ErrHumanVerificationConflict
	default:
		return nil
	}
}
