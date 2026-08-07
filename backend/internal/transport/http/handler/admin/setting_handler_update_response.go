package admin

import (
	"log/slog"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/shared/response"

	"github.com/gin-gonic/gin"
)

func (h *SettingHandler) writeSettingsUpdateResponse(
	c *gin.Context,
	previousSettings *service.SystemSettings,
	submittedReq UpdateSettingsRequest,
) {
	updatedSettings, err := h.settingService.GetAllSettings(c.Request.Context())
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}
	if h.opsService != nil {
		h.opsService.SetMonitoringEnabled(updatedSettings.OpsMonitoringEnabled)
	}
	h.auditSettingsUpdate(c, previousSettings, updatedSettings, submittedReq)
	passkeyConfigured, passkeyRPID, passkeyRPOrigins := h.settingService.PasskeyConfiguration()
	payload := buildSettingsUpdateResponsePayload(
		updatedSettings,
		h.settingService.IsTotpEncryptionKeyConfigured(),
		passkeyConfigured,
		passkeyRPID,
		passkeyRPOrigins,
	)
	if fastPolicy, err := h.settingService.GetOpenAIFastPolicySettings(c.Request.Context()); err != nil {
		slog.Error("openai_fast_policy_settings_get_failed", "error", err)
	} else if fastPolicy != nil {
		payload.OpenAIFastPolicySettings = openaiFastPolicySettingsToDTO(fastPolicy)
	}
	response.Success(c, payload)
}
