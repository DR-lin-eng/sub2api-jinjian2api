package handler

import (
	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/shared/response"
	"github.com/Wei-Shaw/sub2api/internal/shared/timezone"
	"github.com/Wei-Shaw/sub2api/internal/transport/http/handler/dto"

	"github.com/gin-gonic/gin"
)

// SettingHandler 公开设置处理器（无需认证）
type SettingHandler struct {
	settingService *service.SettingService
	version        string
}

// NewSettingHandler 创建公开设置处理器
func NewSettingHandler(settingService *service.SettingService, version string) *SettingHandler {
	return &SettingHandler{
		settingService: settingService,
		version:        version,
	}
}

// GetPublicSettings 获取公开设置
// GET /api/v1/settings/public
func (h *SettingHandler) GetPublicSettings(c *gin.Context) {
	settings, err := h.settingService.GetPublicSettings(c.Request.Context())
	if err != nil {
		response.ErrorFrom(c, err)
		return
	}

	response.Success(c, dto.PublicSettings{
		TotpEnabled:                          settings.TotpEnabled,
		PasskeyEnabled:                       settings.PasskeyEnabled,
		SiteName:                             settings.SiteName,
		SiteLogo:                             settings.SiteLogo,
		APIBaseURL:                           settings.APIBaseURL,
		DocURL:                               settings.DocURL,
		HideCcsImportButton:                  settings.HideCcsImportButton,
		TableDefaultPageSize:                 settings.TableDefaultPageSize,
		TablePageSizeOptions:                 settings.TablePageSizeOptions,
		CustomEndpoints:                      dto.ParseCustomEndpoints(settings.CustomEndpoints),
		Version:                              h.version,
		ServerTimezone:                       timezone.Name(),
		ServerUTCOffset:                      timezone.UTCOffset(),
		ChannelMonitorEnabled:                settings.ChannelMonitorEnabled,
		ChannelMonitorDefaultIntervalSeconds: settings.ChannelMonitorDefaultIntervalSeconds,
	})
}
