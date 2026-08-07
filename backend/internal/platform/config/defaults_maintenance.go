package config

import "github.com/spf13/viper"

func setMaintenanceDefaults() {
	// TokenRefresh
	viper.SetDefault("token_refresh.enabled", true)
	viper.SetDefault("token_refresh.check_interval_minutes", 5)        // 每5分钟检查一次
	viper.SetDefault("token_refresh.refresh_before_expiry_hours", 0.5) // 提前30分钟刷新（适配Google 1小时token）
	viper.SetDefault("token_refresh.max_retries", 3)                   // 最多重试3次
	viper.SetDefault("token_refresh.retry_backoff_seconds", 2)         // 重试退避基础2秒
	viper.SetDefault("token_refresh.candidate_page_size", 200)
	viper.SetDefault("token_refresh.provider_concurrency", 4)
	viper.SetDefault("token_refresh.provider_qps", 2)
	viper.SetDefault("token_refresh.provider_failure_threshold", 3)
	viper.SetDefault("token_refresh.attempt_timeout_seconds", 15)
	viper.SetDefault("token_refresh.cycle_timeout_seconds", 240)

	// Gemini OAuth - configure via environment variables or config file
	// GEMINI_OAUTH_CLIENT_ID and GEMINI_OAUTH_CLIENT_SECRET
	// Default: uses Gemini CLI public credentials (set via environment)
	viper.SetDefault("gemini.oauth.client_id", "")
	viper.SetDefault("gemini.oauth.client_secret", "")
	viper.SetDefault("gemini.oauth.scopes", "")
	viper.SetDefault("gemini.quota.policy", "")
}
