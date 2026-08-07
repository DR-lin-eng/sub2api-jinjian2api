package admin

import (
	"strings"

	"github.com/Wei-Shaw/sub2api/internal/shared/response"

	"github.com/gin-gonic/gin"
)

func (h *SettingHandler) validateCoreSettingsUpdate(c *gin.Context, prepared *preparedSettingsUpdate) bool {
	req := prepared.request
	previousSettings := prepared.previousSettings

	if req.TableDefaultPageSize <= 0 {
		req.TableDefaultPageSize = previousSettings.TableDefaultPageSize
	}
	if req.TablePageSizeOptions == nil {
		req.TablePageSizeOptions = previousSettings.TablePageSizeOptions
	}

	req.SMTPHost = strings.TrimSpace(req.SMTPHost)
	req.SMTPUsername = strings.TrimSpace(req.SMTPUsername)
	req.SMTPPassword = strings.TrimSpace(req.SMTPPassword)
	req.SMTPFrom = strings.TrimSpace(req.SMTPFrom)
	req.SMTPFromName = strings.TrimSpace(req.SMTPFromName)
	if req.SMTPPort <= 0 {
		req.SMTPPort = 587
	}
	if req.SMTPHost == "" && previousSettings.SMTPHost != "" {
		req.SMTPHost = previousSettings.SMTPHost
		req.SMTPPort = previousSettings.SMTPPort
		req.SMTPUsername = previousSettings.SMTPUsername
		req.SMTPFrom = previousSettings.SMTPFrom
		req.SMTPFromName = previousSettings.SMTPFromName
		req.SMTPUseTLS = previousSettings.SMTPUseTLS
	}

	if req.TotpEnabled && !previousSettings.TotpEnabled && !h.settingService.IsTotpEncryptionKeyConfigured() {
		response.BadRequest(c, "Cannot enable TOTP: a stable TOTP encryption key is not available. Configure TOTP_ENCRYPTION_KEY consistently on every instance or verify database secret bootstrap.")
		return false
	}
	return true
}
