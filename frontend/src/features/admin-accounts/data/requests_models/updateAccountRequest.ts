export interface UpdateAccountRequest {
  name?: string
  notes?: string
  type?: string
  credentials?: Record<string, unknown>
  extra?: Record<string, unknown>
  proxy_id?: number
  concurrency?: number
  load_factor?: number
  priority?: number
  rate_multiplier?: number
  schedulable?: boolean
  status?: 'active' | 'inactive' | 'error'
  group_ids?: number[]
  expires_at?: number
  auto_pause_on_expired?: boolean
  confirm_mixed_channel_risk?: boolean
}
