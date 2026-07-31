import type { APIMode, BodyOverrideMode } from '@/core/constants/channelMonitor'

export interface UpdateChannelMonitorTemplateRequest {
  name?: string
  api_mode?: APIMode
  description?: string
  extra_headers?: Record<string, string>
  body_override_mode?: BodyOverrideMode
  body_override?: Record<string, unknown> | null
}
