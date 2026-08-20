package routes

import (
	"database/sql"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/platform/middleware"
	"github.com/Wei-Shaw/sub2api/internal/transport/http/handler"
	servermiddleware "github.com/Wei-Shaw/sub2api/internal/transport/http/server/middleware"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

// RegisterAuthRoutes 注册认证相关路由
func RegisterAuthRoutes(
	v1 *gin.RouterGroup,
	h *handler.Handlers,
	jwtAuth servermiddleware.JWTAuthMiddleware,
	redisClient *redis.Client,
	db *sql.DB,
	settingService *service.SettingService,
	panelRateLimiter *servermiddleware.PanelRateLimiter,
) {
	rateLimiter := middleware.NewRateLimiter(redisClient)
	credentialCipher := middleware.NewCredentialCipher(redisClient, db)
	v1.GET(
		"/auth/credential-key",
		servermiddleware.BackendModeAuthGuard(settingService),
		credentialCipher.PublicKey,
	)
	v1.POST(
		"/auth/login",
		servermiddleware.BackendModeAuthGuard(settingService),
		credentialCipher.RequireBrowserFlow(),
		rateLimiter.LimitWithOptions("auth-login", 20, time.Minute, middleware.RateLimitOptions{
			FailureMode: middleware.RateLimitFailClose,
		}),
		h.Auth.Login,
	)

	// The 2API branch only exposes local administrator session endpoints.
	auth := v1.Group("/auth")
	auth.Use(servermiddleware.BackendModeAuthGuard(settingService))
	{
		auth.POST("/login/2fa", rateLimiter.LimitWithOptions("auth-login-2fa", 20, time.Minute, middleware.RateLimitOptions{
			FailureMode: middleware.RateLimitFailClose,
		}), h.Auth.Login2FA)
		auth.POST("/passkey/login/begin", rateLimiter.LimitWithOptions("passkey-login-begin", 20, time.Minute, middleware.RateLimitOptions{
			FailureMode: middleware.RateLimitFailClose,
		}), h.Passkey.BeginLogin)
		auth.POST("/passkey/login/finish", rateLimiter.LimitWithOptions("passkey-login-finish", 20, time.Minute, middleware.RateLimitOptions{
			FailureMode: middleware.RateLimitFailClose,
		}), h.Passkey.FinishLogin)
		auth.POST("/refresh", rateLimiter.LimitWithOptions("refresh-token", 30, time.Minute, middleware.RateLimitOptions{
			FailureMode: middleware.RateLimitFailClose,
		}), h.Auth.RefreshToken)
		auth.POST("/logout", h.Auth.Logout)
	}

	// 公开设置（无需认证）：每次请求都会查询 DB，按客户端 IP 兜底限流，
	// 防止匿名高频刷接口打爆数据库（反代内部地址会被自动跳过，不会误伤）。
	settings := v1.Group("/settings")
	settings.Use(panelRateLimiter.PublicIP())
	{
		settings.GET("/public", h.Setting.GetPublicSettings)
	}

	// 需要认证的当前用户信息
	authenticated := v1.Group("")
	authenticated.Use(gin.HandlerFunc(jwtAuth))
	authenticated.Use(servermiddleware.BackendModeUserGuard(settingService))
	authenticated.Use(panelRateLimiter.Authenticated())
	{
		authenticated.GET("/auth/me", h.Auth.GetCurrentUser)
		// 撤销所有会话（需要认证）
		authenticated.POST("/auth/revoke-all-sessions", h.Auth.RevokeAllSessions)
	}
}
