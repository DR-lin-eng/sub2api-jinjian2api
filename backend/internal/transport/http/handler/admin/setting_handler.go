package admin

import (
	"log/slog"
	"regexp"
	"strings"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/shared/response"
	"github.com/Wei-Shaw/sub2api/internal/transport/http/handler/dto"

	"github.com/gin-gonic/gin"
)

var semverPattern = regexp.MustCompile(`^\d+\.\d+\.\d+$`)

type SettingHandler struct {
	settingService           *service.SettingService
	emailService             *service.EmailService
	opsService               *service.OpsService
	notificationEmailService *service.NotificationEmailService
	totpService              *service.TotpService
	userService              *service.UserService
	tempUnschedulableCleaner *service.GlobalTempUnschedulableCleaner
}

func NewSettingHandler(settingService *service.SettingService, emailService *service.EmailService, opsService *service.OpsService, _ any, _ any, _ any) *SettingHandler {
	return &SettingHandler{
		settingService: settingService,
		emailService:   emailService,
		opsService:     opsService,
	}
}

func (h *SettingHandler) SetNotificationEmailService(notificationEmailService *service.NotificationEmailService) {
	h.notificationEmailService = notificationEmailService
}

func (h *SettingHandler) SetStepUpDeps(totpService *service.TotpService, userService *service.UserService) {
	h.totpService = totpService
	h.userService = userService
}

func (h *SettingHandler) SetGlobalTempUnschedulableCleaner(cleaner *service.GlobalTempUnschedulableCleaner) {
	h.tempUnschedulableCleaner = cleaner
}

// GetSettings returns the gateway and local-administrator settings document.
func (h *SettingHandler) GetSettings(c *gin.Context) {
	settings, err := h.settingService.GetAllSettings(c.Request.Context())
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}

	passkeyConfigured, passkeyRPID, passkeyRPOrigins := h.settingService.PasskeyConfiguration()
	payload := buildSettingsUpdateResponsePayload(
		settings,
		h.settingService.IsTotpEncryptionKeyConfigured(),
		passkeyConfigured,
		passkeyRPID,
		passkeyRPOrigins,
	)
	payload.OpsMonitoringEnabled = h.opsService != nil &&
		h.opsService.IsMonitoringEnabled(c.Request.Context()) &&
		settings.OpsMonitoringEnabled

	if fastPolicy, err := h.settingService.GetOpenAIFastPolicySettings(c.Request.Context()); err != nil {
		slog.Error("openai_fast_policy_settings_get_failed", "error", err)
	} else if fastPolicy != nil {
		payload.OpenAIFastPolicySettings = openaiFastPolicySettingsToDTO(fastPolicy)
	}

	response.Success(c, payload)
}

func openaiFastPolicySettingsToDTO(settings *service.OpenAIFastPolicySettings) *dto.OpenAIFastPolicySettings {
	if settings == nil {
		return nil
	}
	rules := make([]dto.OpenAIFastPolicyRule, len(settings.Rules))
	for i, rule := range settings.Rules {
		rules[i] = dto.OpenAIFastPolicyRule(rule)
	}
	return &dto.OpenAIFastPolicySettings{Rules: rules}
}

func openaiFastPolicySettingsFromDTO(settings *dto.OpenAIFastPolicySettings) *service.OpenAIFastPolicySettings {
	if settings == nil {
		return nil
	}
	rules := make([]service.OpenAIFastPolicyRule, len(settings.Rules))
	for i, rule := range settings.Rules {
		rules[i] = service.OpenAIFastPolicyRule(rule)
		tier := strings.ToLower(strings.TrimSpace(rules[i].ServiceTier))
		if tier == "" {
			tier = service.OpenAIFastTierAny
		}
		rules[i].ServiceTier = tier
	}
	return &service.OpenAIFastPolicySettings{Rules: rules}
}
