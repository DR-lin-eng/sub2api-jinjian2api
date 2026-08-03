package middleware

import (
	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/shared/response"

	"github.com/gin-gonic/gin"
)

// SupportChatFeatureGuard blocks support chat APIs when the runtime feature
// switch is disabled. It is intentionally fail-open to keep existing support
// flows available when settings storage is temporarily unreachable.
func SupportChatFeatureGuard(settingService *service.SettingService) gin.HandlerFunc {
	return func(c *gin.Context) {
		if settingService == nil || settingService.IsSupportChatEnabled(c.Request.Context()) {
			c.Next()
			return
		}
		response.Forbidden(c, "Support chat is disabled.")
		c.Abort()
	}
}
