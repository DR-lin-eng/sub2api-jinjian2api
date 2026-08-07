package repository

import (
	"context"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/shared/timezone"
	"github.com/Wei-Shaw/sub2api/internal/shared/usagestats"
)

func (r *usageLogRepository) GetAPIKeyDashboardStats(ctx context.Context, apiKeyID int64) (*usagestats.APIKeyDashboardStats, error) {
	stats := &usagestats.APIKeyDashboardStats{}
	if err := scanSingleRow(
		ctx,
		r.sql,
		`SELECT
			COUNT(*) AS total_requests,
			COALESCE(SUM(input_tokens), 0) AS total_input_tokens,
			COALESCE(SUM(output_tokens), 0) AS total_output_tokens,
			COALESCE(SUM(cache_creation_tokens), 0) AS total_cache_creation_tokens,
			COALESCE(SUM(cache_read_tokens), 0) AS total_cache_read_tokens,
			COALESCE(SUM(total_cost), 0) AS total_cost,
			COALESCE(SUM(actual_cost), 0) AS total_actual_cost,
			COALESCE(AVG(duration_ms), 0) AS avg_duration_ms,
			COUNT(*) FILTER (WHERE created_at >= $2) AS today_requests,
			COALESCE(SUM(input_tokens) FILTER (WHERE created_at >= $2), 0) AS today_input_tokens,
			COALESCE(SUM(output_tokens) FILTER (WHERE created_at >= $2), 0) AS today_output_tokens,
			COALESCE(SUM(cache_creation_tokens) FILTER (WHERE created_at >= $2), 0) AS today_cache_creation_tokens,
			COALESCE(SUM(cache_read_tokens) FILTER (WHERE created_at >= $2), 0) AS today_cache_read_tokens,
			COALESCE(SUM(total_cost) FILTER (WHERE created_at >= $2), 0) AS today_cost,
			COALESCE(SUM(actual_cost) FILTER (WHERE created_at >= $2), 0) AS today_actual_cost
		FROM usage_logs
		WHERE api_key_id = $1`,
		[]any{apiKeyID, timezone.Today()},
		&stats.TotalRequests,
		&stats.TotalInputTokens,
		&stats.TotalOutputTokens,
		&stats.TotalCacheCreationTokens,
		&stats.TotalCacheReadTokens,
		&stats.TotalCost,
		&stats.TotalActualCost,
		&stats.AverageDurationMs,
		&stats.TodayRequests,
		&stats.TodayInputTokens,
		&stats.TodayOutputTokens,
		&stats.TodayCacheCreationTokens,
		&stats.TodayCacheReadTokens,
		&stats.TodayCost,
		&stats.TodayActualCost,
	); err != nil {
		return nil, err
	}

	stats.TotalTokens = stats.TotalInputTokens + stats.TotalOutputTokens + stats.TotalCacheCreationTokens + stats.TotalCacheReadTokens
	stats.TodayTokens = stats.TodayInputTokens + stats.TodayOutputTokens + stats.TodayCacheCreationTokens + stats.TodayCacheReadTokens

	fiveMinutesAgo := time.Now().Add(-5 * time.Minute)
	var requestCount, tokenCount int64
	if err := scanSingleRow(
		ctx,
		r.sql,
		`SELECT COUNT(*), COALESCE(SUM(input_tokens + output_tokens + cache_creation_tokens + cache_read_tokens), 0)
		 FROM usage_logs WHERE created_at >= $1 AND api_key_id = $2`,
		[]any{fiveMinutesAgo, apiKeyID},
		&requestCount,
		&tokenCount,
	); err != nil {
		return nil, err
	}
	stats.Rpm = requestCount / 5
	stats.Tpm = tokenCount / 5

	return stats, nil
}
