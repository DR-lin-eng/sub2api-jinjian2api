import type { APIMode, BodyOverrideMode, MonitorMode, Provider } from '@/core/constants/channelMonitor'

export interface UpdateChannelMonitorRequest {
  name?: string
  provider?: Provider
  monitor_mode?: MonitorMode
  channel_id?: number | null
  clear_channel?: boolean
  group_id?: number | null
  clear_group?: boolean
  api_mode?: APIMode
  endpoint?: string
  api_key?: string
  primary_model?: string
  extra_models?: string[]
  group_name?: string
  enabled?: boolean
  interval_seconds?: number
  jitter_seconds?: number
  template_id?: number | null
  clear_template?: boolean
  extra_headers?: Record<string, string>
  body_override_mode?: BodyOverrideMode
  body_override?: Record<string, unknown> | null
}
