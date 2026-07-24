export interface UpdateAdvancedSettingsRequest {
  data_retention: {
    user_request_log_retention_days: number
    cleanup_enabled: boolean
    cleanup_schedule: string
    error_log_retention_days: number
    minute_metrics_retention_days: number
    hourly_metrics_retention_days: number
  }
  aggregation: {
    aggregation_enabled: boolean
  }
  openai_account_quota_auto_pause: {
    default_threshold_5h: number
    default_threshold_7d: number
  }
  ignore_count_tokens_errors: boolean
  ignore_context_canceled: boolean
  ignore_no_available_accounts: boolean
  ignore_invalid_api_key_errors: boolean
  ignore_insufficient_balance_errors: boolean
  display_openai_token_stats: boolean
  display_user_usage_stats: boolean
  display_alert_events: boolean
  display_system_logs: boolean
  display_concurrency: boolean
  display_switch_rate_trend: boolean
  display_throughput_trend: boolean
  display_latency_histogram: boolean
  display_error_distribution: boolean
  display_error_trend: boolean
  display_image_generation_stats: boolean
  auto_refresh_enabled: boolean
  auto_refresh_interval_seconds: number
}
