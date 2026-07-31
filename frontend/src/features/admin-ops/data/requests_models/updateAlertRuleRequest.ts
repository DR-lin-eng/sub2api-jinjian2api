export interface UpdateAlertRuleRequest {
  name?: string
  description?: string
  enabled?: boolean
  metric_type?: string
  operator?: string
  threshold?: number
  window_minutes?: number
  sustained_minutes?: number
  severity?: string
  cooldown_minutes?: number
  notify_email?: boolean
  filters?: Record<string, unknown>
}
