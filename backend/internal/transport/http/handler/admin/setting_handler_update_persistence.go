package admin

import (
	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/shared/response"

	"github.com/gin-gonic/gin"
)

func (h *SettingHandler) persistSettingsUpdate(
	c *gin.Context,
	prepared *preparedSettingsUpdate,
	omitted service.OmittedSettingKeys,
) bool {
	settings := buildSystemSettingsUpdate(prepared)
	if err := h.settingService.UpdateSettingsOmitting(c.Request.Context(), settings, omitted); err != nil {
		response.ErrorFrom(c, err)
		return false
	}

	req := prepared.request
	// OpenAI fast policy uses a dedicated setting key and retains omission semantics.
	if req.OpenAIFastPolicySettings != nil {
		if err := h.settingService.SetOpenAIFastPolicySettings(
			c.Request.Context(),
			openaiFastPolicySettingsFromDTO(req.OpenAIFastPolicySettings),
		); err != nil {
			response.BadRequest(c, err.Error())
			return false
		}
	}

	return true
}
