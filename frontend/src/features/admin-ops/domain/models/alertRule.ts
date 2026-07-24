export type AlertSeverity = 'critical' | 'warning' | 'info'
export type ThresholdMode = 'count' | 'percentage' | 'both'
export type MetricType =
  | 'success_rate'
  | 'error_rate'
  | 'upstream_error_rate'
  | 'cpu_usage_percent'
  | 'memory_usage_percent'
  | 'concurrency_queue_depth'
  | 'group_available_accounts'
  | 'group_available_ratio'
  | 'group_rate_limit_ratio'
  | 'account_rate_limited_count'
  | 'account_error_count'
  | 'account_error_ratio'
  | 'account_temp_unscheduled_count'
  | 'overload_account_count'
export type Operator = '>' | '>=' | '<' | '<=' | '==' | '!='

export class AlertRule {
  id!: number
  name!: string
  description!: string
  enabled!: boolean
  metricType!: MetricType
  operator!: Operator
  threshold!: number
  windowMinutes!: number
  sustainedMinutes!: number
  severity!: string
  cooldownMinutes!: number
  notifyEmail!: boolean
  filters!: Record<string, unknown>
  createdAt!: string
  updatedAt!: string
  lastTriggeredAt!: string
}
