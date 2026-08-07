package handler

import (
	"context"
	"net/http"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/application/service"
	"github.com/Wei-Shaw/sub2api/internal/shared/timezone"
	middleware2 "github.com/Wei-Shaw/sub2api/internal/transport/http/server/middleware"

	"github.com/gin-gonic/gin"
)

// Usage returns API-key-scoped usage statistics. Cost fields are informational
// and are never interpreted as a wallet balance, subscription, or spend limit.
func (h *GatewayHandler) Usage(c *gin.Context) {
	apiKey, ok := middleware2.GetAPIKeyFromContext(c)
	if !ok {
		h.errorResponse(c, http.StatusUnauthorized, "authentication_error", "Invalid API key")
		return
	}

	subject, ok := middleware2.GetAuthSubjectFromContext(c)
	if !ok {
		h.errorResponse(c, http.StatusUnauthorized, "authentication_error", "Invalid API key")
		return
	}

	startTime, endTime := h.parseUsageDateRange(c)
	days, ok := parseAPIKeyDailyUsageDays(c.DefaultQuery("days", ""))
	if !ok {
		h.errorResponse(c, http.StatusBadRequest, "invalid_request_error", "Invalid days, allowed range is 1-90")
		return
	}

	usageData := h.buildUsageData(c.Request.Context(), apiKey.ID)
	dailyUsage := h.buildAPIKeyDailyUsage(c, subject.UserID, apiKey.ID, days)

	var modelStats any
	if h.usageService != nil {
		if stats, err := h.usageService.GetAPIKeyModelStats(c.Request.Context(), apiKey.ID, startTime, endTime); err == nil && len(stats) > 0 {
			modelStats = stats
		}
	}

	resp := gin.H{
		"mode":     "informational",
		"isValid":  apiKey.Status == service.StatusAPIKeyActive,
		"status":   apiKey.Status,
		"apiKeyId": apiKey.ID,
		"unit":     "USD",
	}
	if apiKey.ExpiresAt != nil {
		resp["expires_at"] = apiKey.ExpiresAt
		resp["days_until_expiry"] = apiKey.GetDaysUntilExpiry()
	}
	if usageData != nil {
		resp["usage"] = usageData
	}
	if dailyUsage != nil {
		resp["daily_usage"] = dailyUsage
	}
	if modelStats != nil {
		resp["model_stats"] = modelStats
	}

	c.JSON(http.StatusOK, resp)
}

func (h *GatewayHandler) parseUsageDateRange(c *gin.Context) (time.Time, time.Time) {
	now := timezone.Now()
	endTime := now
	startTime := now.AddDate(0, 0, -30)

	if value := c.Query("start_date"); value != "" {
		if parsed, err := timezone.ParseInLocation("2006-01-02", value); err == nil {
			startTime = parsed
		}
	}
	if value := c.Query("end_date"); value != "" {
		if parsed, err := timezone.ParseInLocation("2006-01-02", value); err == nil {
			endTime = parsed.AddDate(0, 0, 1)
		}
	}
	return startTime, endTime
}

func (h *GatewayHandler) buildUsageData(ctx context.Context, apiKeyID int64) gin.H {
	if h.usageService == nil {
		return nil
	}
	dashStats, err := h.usageService.GetAPIKeyDashboardStats(ctx, apiKeyID)
	if err != nil || dashStats == nil {
		return nil
	}
	return gin.H{
		"today": gin.H{
			"requests":              dashStats.TodayRequests,
			"input_tokens":          dashStats.TodayInputTokens,
			"output_tokens":         dashStats.TodayOutputTokens,
			"cache_creation_tokens": dashStats.TodayCacheCreationTokens,
			"cache_read_tokens":     dashStats.TodayCacheReadTokens,
			"total_tokens":          dashStats.TodayTokens,
			"cost":                  dashStats.TodayCost,
			"actual_cost":           dashStats.TodayActualCost,
		},
		"total": gin.H{
			"requests":              dashStats.TotalRequests,
			"input_tokens":          dashStats.TotalInputTokens,
			"output_tokens":         dashStats.TotalOutputTokens,
			"cache_creation_tokens": dashStats.TotalCacheCreationTokens,
			"cache_read_tokens":     dashStats.TotalCacheReadTokens,
			"total_tokens":          dashStats.TotalTokens,
			"cost":                  dashStats.TotalCost,
			"actual_cost":           dashStats.TotalActualCost,
		},
		"average_duration_ms": dashStats.AverageDurationMs,
		"rpm":                 dashStats.Rpm,
		"tpm":                 dashStats.Tpm,
	}
}

func (h *GatewayHandler) buildAPIKeyDailyUsage(c *gin.Context, userID, apiKeyID int64, days int) any {
	if h.usageService == nil {
		return nil
	}
	startTime, endTime := apiKeyDailyUsageRange(days, c.Query("timezone"))
	stats, err := h.usageService.GetAPIKeyDailyUsage(c.Request.Context(), userID, apiKeyID, startTime, endTime)
	if err != nil {
		return nil
	}
	return stats
}
