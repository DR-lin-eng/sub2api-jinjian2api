// Package usagestats provides types for usage statistics and reporting.
package usagestats

import "time"

const (
	ModelSourceRequested = "requested"
	ModelSourceUpstream  = "upstream"
	ModelSourceMapping   = "mapping"
)

func IsValidModelSource(source string) bool {
	switch source {
	case ModelSourceRequested, ModelSourceUpstream, ModelSourceMapping:
		return true
	default:
		return false
	}
}

func NormalizeModelSource(source string) string {
	if IsValidModelSource(source) {
		return source
	}
	return ModelSourceRequested
}

// TrendDataPoint represents a single point in trend data
type TrendDataPoint struct {
	Date                string  `json:"date"`
	Requests            int64   `json:"requests"`
	InputTokens         int64   `json:"input_tokens"`
	OutputTokens        int64   `json:"output_tokens"`
	CacheCreationTokens int64   `json:"cache_creation_tokens"`
	CacheReadTokens     int64   `json:"cache_read_tokens"`
	TotalTokens         int64   `json:"total_tokens"`
	Cost                float64 `json:"cost"`        // 标准计费
	ActualCost          float64 `json:"actual_cost"` // 实际扣除
}

// ModelStat represents usage statistics for a single model
type ModelStat struct {
	Model               string  `json:"model"`
	Requests            int64   `json:"requests"`
	InputTokens         int64   `json:"input_tokens"`
	OutputTokens        int64   `json:"output_tokens"`
	CacheCreationTokens int64   `json:"cache_creation_tokens"`
	CacheReadTokens     int64   `json:"cache_read_tokens"`
	TotalTokens         int64   `json:"total_tokens"`
	Cost                float64 `json:"cost"`         // 标准计费
	ActualCost          float64 `json:"actual_cost"`  // 实际扣除
	AccountCost         float64 `json:"account_cost"` // 账号成本
}

// EndpointStat represents usage statistics for a single request endpoint.
type EndpointStat struct {
	Endpoint    string  `json:"endpoint"`
	Requests    int64   `json:"requests"`
	TotalTokens int64   `json:"total_tokens"`
	Cost        float64 `json:"cost"`        // 标准计费
	ActualCost  float64 `json:"actual_cost"` // 实际扣除
}

// GroupUsageSummary represents today's and cumulative cost for a single group.
type GroupUsageSummary struct {
	GroupID   int64   `json:"group_id"`
	TodayCost float64 `json:"today_cost"`
	TotalCost float64 `json:"total_cost"`
}

// GroupStat represents usage statistics for a single group
type GroupStat struct {
	GroupID     int64   `json:"group_id"`
	GroupName   string  `json:"group_name"`
	Requests    int64   `json:"requests"`
	TotalTokens int64   `json:"total_tokens"`
	Cost        float64 `json:"cost"`         // 标准计费
	ActualCost  float64 `json:"actual_cost"`  // 实际扣除
	AccountCost float64 `json:"account_cost"` // 账号成本
}

// APIKeyUsageTrendPoint represents API key usage trend data point
type APIKeyUsageTrendPoint struct {
	Date     string `json:"date"`
	APIKeyID int64  `json:"api_key_id"`
	KeyName  string `json:"key_name"`
	Requests int64  `json:"requests"`
	Tokens   int64  `json:"tokens"`
}

// APIKeyDailyUsagePoint represents one day of usage for a single API key.
type APIKeyDailyUsagePoint struct {
	Date             string  `json:"date"`
	Requests         int64   `json:"requests"`
	InputTokens      int64   `json:"input_tokens"`
	OutputTokens     int64   `json:"output_tokens"`
	CacheReadTokens  int64   `json:"cache_read_tokens"`
	CacheWriteTokens int64   `json:"cache_write_tokens"`
	TotalTokens      int64   `json:"total_tokens"`
	Cost             float64 `json:"cost"`        // 标准计费
	ActualCost       float64 `json:"actual_cost"` // 实际扣除
}

// APIKeyDashboardStats summarizes one downstream API key.
type APIKeyDashboardStats struct {
	// 累计 Token 使用统计
	TotalRequests            int64   `json:"total_requests"`
	TotalInputTokens         int64   `json:"total_input_tokens"`
	TotalOutputTokens        int64   `json:"total_output_tokens"`
	TotalCacheCreationTokens int64   `json:"total_cache_creation_tokens"`
	TotalCacheReadTokens     int64   `json:"total_cache_read_tokens"`
	TotalTokens              int64   `json:"total_tokens"`
	TotalCost                float64 `json:"total_cost"`        // 累计标准计费
	TotalActualCost          float64 `json:"total_actual_cost"` // 累计实际扣除

	// 今日 Token 使用统计
	TodayRequests            int64   `json:"today_requests"`
	TodayInputTokens         int64   `json:"today_input_tokens"`
	TodayOutputTokens        int64   `json:"today_output_tokens"`
	TodayCacheCreationTokens int64   `json:"today_cache_creation_tokens"`
	TodayCacheReadTokens     int64   `json:"today_cache_read_tokens"`
	TodayTokens              int64   `json:"today_tokens"`
	TodayCost                float64 `json:"today_cost"`        // 今日标准计费
	TodayActualCost          float64 `json:"today_actual_cost"` // 今日实际扣除

	// 性能统计
	AverageDurationMs float64 `json:"average_duration_ms"`

	// 性能指标
	Rpm int64 `json:"rpm"` // 近5分钟平均每分钟请求数
	Tpm int64 `json:"tpm"` // 近5分钟平均每分钟Token数

}

// UsageLogFilters represents filters for usage log queries
type UsageLogFilters struct {
	UserID    int64
	APIKeyID  int64
	AccountID int64
	GroupID   int64
	RequestID string
	Model     string
	// ModelFilterSource controls how Model is matched. Empty preserves raw usage_logs.model semantics.
	ModelFilterSource string
	RequestType       *int16
	Stream            *bool
	BillingMode       string
	StartTime         *time.Time
	EndTime           *time.Time
	// ExactTotal requests exact COUNT(*) for pagination. Default false for fast large-table paging.
	ExactTotal bool
}

// UsageStats represents usage statistics
type UsageStats struct {
	TotalRequests            int64          `json:"total_requests"`
	TotalInputTokens         int64          `json:"total_input_tokens"`
	TotalOutputTokens        int64          `json:"total_output_tokens"`
	TotalCacheTokens         int64          `json:"total_cache_tokens"`
	TotalCacheCreationTokens int64          `json:"total_cache_creation_tokens"`
	TotalCacheReadTokens     int64          `json:"total_cache_read_tokens"`
	TotalTokens              int64          `json:"total_tokens"`
	TotalCost                float64        `json:"total_cost"`
	TotalActualCost          float64        `json:"total_actual_cost"`
	TotalAccountCost         *float64       `json:"total_account_cost,omitempty"`
	AverageDurationMs        float64        `json:"average_duration_ms"`
	Endpoints                []EndpointStat `json:"endpoints,omitempty"`
	UpstreamEndpoints        []EndpointStat `json:"upstream_endpoints,omitempty"`
	EndpointPaths            []EndpointStat `json:"endpoint_paths,omitempty"`
}

// BatchAPIKeyUsageStats represents usage stats for a single API key
type BatchAPIKeyUsageStats struct {
	APIKeyID          int64   `json:"api_key_id"`
	TodayActualCost   float64 `json:"today_actual_cost"`
	TotalActualCost   float64 `json:"total_actual_cost"`
	TotalTokens       int64   `json:"total_tokens"`
	PendingActualCost float64 `json:"pending_actual_cost"`
}

// AccountUsageHistory represents daily usage history for an account
type AccountUsageHistory struct {
	Date       string  `json:"date"`
	Label      string  `json:"label"`
	Requests   int64   `json:"requests"`
	Tokens     int64   `json:"tokens"`
	Cost       float64 `json:"cost"`        // 标准计费（total_cost）
	ActualCost float64 `json:"actual_cost"` // 账号口径费用（total_cost * account_rate_multiplier）
	UserCost   float64 `json:"user_cost"`   // 用户口径费用（actual_cost，受分组倍率影响）
}

// AccountUsageSummary represents summary statistics for an account
type AccountUsageSummary struct {
	Days              int      `json:"days"`
	ActualDaysUsed    int      `json:"actual_days_used"`
	TotalCost         float64  `json:"total_cost"`      // 账号口径费用
	TotalUserCost     float64  `json:"total_user_cost"` // 用户口径费用
	TotalStandardCost float64  `json:"total_standard_cost"`
	TotalRequests     int64    `json:"total_requests"`
	TotalTokens       int64    `json:"total_tokens"`
	AvgDailyCost      float64  `json:"avg_daily_cost"` // 账号口径日均
	AvgDailyUserCost  float64  `json:"avg_daily_user_cost"`
	AvgDailyRequests  float64  `json:"avg_daily_requests"`
	AvgDailyTokens    float64  `json:"avg_daily_tokens"`
	AvgDurationMs     float64  `json:"avg_duration_ms"`
	AvgFirstTokenMs   *float64 `json:"avg_first_token_ms"`
	Today             *struct {
		Date     string  `json:"date"`
		Cost     float64 `json:"cost"`
		UserCost float64 `json:"user_cost"`
		Requests int64   `json:"requests"`
		Tokens   int64   `json:"tokens"`
	} `json:"today"`
	HighestCostDay *struct {
		Date     string  `json:"date"`
		Label    string  `json:"label"`
		Cost     float64 `json:"cost"`
		UserCost float64 `json:"user_cost"`
		Requests int64   `json:"requests"`
	} `json:"highest_cost_day"`
	HighestRequestDay *struct {
		Date     string  `json:"date"`
		Label    string  `json:"label"`
		Requests int64   `json:"requests"`
		Cost     float64 `json:"cost"`
		UserCost float64 `json:"user_cost"`
	} `json:"highest_request_day"`
}

// AccountUsageStatsResponse represents the full usage statistics response for an account
type AccountUsageStatsResponse struct {
	History           []AccountUsageHistory `json:"history"`
	Summary           AccountUsageSummary   `json:"summary"`
	Models            []ModelStat           `json:"models"`
	Endpoints         []EndpointStat        `json:"endpoints"`
	UpstreamEndpoints []EndpointStat        `json:"upstream_endpoints"`
}
