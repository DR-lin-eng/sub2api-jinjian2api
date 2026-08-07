package server

import (
	"database/sql"
	"log"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/platform/config"
	coremiddleware "github.com/Wei-Shaw/sub2api/internal/platform/middleware"
	clientip "github.com/Wei-Shaw/sub2api/internal/shared/ip"
	"github.com/Wei-Shaw/sub2api/internal/transport/http/handler"
	middleware2 "github.com/Wei-Shaw/sub2api/internal/transport/http/server/middleware"
	"github.com/Wei-Shaw/sub2api/internal/transport/http/server/routes"
	"github.com/Wei-Shaw/sub2api/internal/transport/webassets"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

// SetupRouter 配置路由器中间件和路由
func SetupRouter(
	r *gin.Engine,
	handlers *handler.Handlers,
	jwtAuth middleware2.JWTAuthMiddleware,
	adminAuth middleware2.AdminAuthMiddleware,
	apiKeyAuth middleware2.APIKeyAuthMiddleware,
	auditLog middleware2.AuditLogMiddleware,
	stepUpAuth middleware2.StepUpAuthMiddleware,
	apiKeyService *service.APIKeyService,
	opsService *service.OpsService,
	settingService *service.SettingService,
	compositeResolver *service.CompositeRouteResolver,
	clientIPResolver *clientip.Resolver,
	cfg *config.Config,
	redisClient *redis.Client,
	db *sql.DB,
) *gin.Engine {
	middleware2.SetIngressRejectRecorder(opsService)

	// 应用中间件
	r.Use(clientIPResolver.Middleware())
	r.Use(coremiddleware.NewCredentialAuthIngressLimiter())
	r.Use(middleware2.RequestLogger())
	// 将客户端 IP + UA 注入 request context，供 token 签发/会话绑定/审计日志统一读取。
	r.Use(middleware2.SessionBindingContext(nil))
	r.Use(middleware2.Logger())
	r.Use(middleware2.CORS(cfg.CORS))
	r.Use(middleware2.SecurityHeaders(cfg.Security.CSP))
	r.Use(middleware2.ServerTiming(cfg.Server.EnableServerTiming))

	// Serve embedded frontend with settings injection if available
	if web.HasEmbeddedFrontend() {
		frontendServer, err := web.NewFrontendServer(settingService) //nolint:staticcheck // SA4023: the !embed stub always errors; embed builds can return nil
		if err != nil {                                              //nolint:staticcheck // SA4023: see above
			log.Printf("Warning: Failed to create frontend server with settings injection: %v, using legacy mode", err)
			r.Use(web.ServeEmbeddedFrontend())
		} else {
			settingService.SetOnUpdateCallback(frontendServer.InvalidateCache)
			r.Use(frontendServer.Middleware())
		}
	}

	// 注册路由
	registerRoutes(r, handlers, jwtAuth, adminAuth, apiKeyAuth, auditLog, stepUpAuth, apiKeyService, opsService, settingService, compositeResolver, cfg, redisClient, db)

	return r
}

// registerRoutes 注册所有 HTTP 路由
func registerRoutes(
	r *gin.Engine,
	h *handler.Handlers,
	jwtAuth middleware2.JWTAuthMiddleware,
	adminAuth middleware2.AdminAuthMiddleware,
	apiKeyAuth middleware2.APIKeyAuthMiddleware,
	auditLog middleware2.AuditLogMiddleware,
	stepUpAuth middleware2.StepUpAuthMiddleware,
	apiKeyService *service.APIKeyService,
	opsService *service.OpsService,
	settingService *service.SettingService,
	compositeResolver *service.CompositeRouteResolver,
	cfg *config.Config,
	redisClient *redis.Client,
	db *sql.DB,
) {
	// 通用路由（健康检查、状态等）
	routes.RegisterCommonRoutes(r)

	// API v1
	v1 := r.Group("/api/v1")

	// 面板 API 限流器：认证接口按用户 ID、公开接口按安全客户端 IP，
	// 防止高频刷管理面接口打爆数据库（阈值可在系统设置中调整）。
	panelRateLimiter := middleware2.NewPanelRateLimiter(redisClient, settingService)

	// 注册各模块路由
	routes.RegisterAuthRoutes(v1, h, jwtAuth, auditLog, redisClient, db, settingService, panelRateLimiter)
	routes.RegisterUserRoutes(v1, h, jwtAuth, auditLog, settingService, panelRateLimiter)
	routes.RegisterAdminRoutes(v1, h, adminAuth, auditLog, stepUpAuth, settingService, panelRateLimiter)
	routes.RegisterGatewayRoutes(r, h, apiKeyAuth, apiKeyService, opsService, settingService, compositeResolver, cfg)
}
