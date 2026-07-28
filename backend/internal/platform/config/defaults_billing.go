package config

import "github.com/spf13/viper"

func setBillingDefaults() {
	// Billing
	viper.SetDefault("billing.circuit_breaker.enabled", true)
	viper.SetDefault("billing.circuit_breaker.failure_threshold", 5)
	viper.SetDefault("billing.circuit_breaker.reset_timeout_seconds", 30)
	viper.SetDefault("billing.circuit_breaker.half_open_requests", 3)
	viper.SetDefault("billing.minimum_balance_reserve", 0.000001)
	viper.SetDefault("billing.user_platform_quota_cache_ttl_seconds", 86400)
	viper.SetDefault("billing.user_platform_quota_sentinel_ttl_seconds", 3600)
	// Billing jobs are committed to PostgreSQL WAL before acknowledgment; Redis
	// is only a rebuildable pending-usage overlay.
	viper.SetDefault("billing.queue.enabled", true)
	viper.SetDefault("billing.queue.consumer_count", 4)
	viper.SetDefault("billing.queue.max_consumer_count", 8)
	viper.SetDefault("billing.queue.read_batch_size", 128)
	viper.SetDefault("billing.queue.read_block_milliseconds", 1000)
	viper.SetDefault("billing.queue.command_timeout_seconds", 15)
	viper.SetDefault("billing.queue.max_retry_delay_seconds", 30)
}
