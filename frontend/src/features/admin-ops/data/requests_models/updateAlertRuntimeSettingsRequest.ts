export interface UpdateAlertRuntimeSettingsRequest {
  evaluation_interval_seconds: number
  distributed_lock: {
    enabled: boolean
    key: string
    ttl_seconds: number
  }
  silencing: {
    enabled: boolean
    global_until_rfc3339: string
    global_reason: string
    entries?: Array<{
      rule_id?: number
      severities?: string[]
      until_rfc3339?: string
      reason?: string
    }>
  }
  thresholds: {
    sla_percent_min?: number | null
    ttft_p99_ms_max?: number | null
    request_error_rate_percent_max?: number | null
    upstream_error_rate_percent_max?: number | null
  }
}
