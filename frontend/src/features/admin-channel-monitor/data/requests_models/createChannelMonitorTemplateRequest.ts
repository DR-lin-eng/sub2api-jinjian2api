import type { APIMode, BodyOverrideMode, Provider } from '@/core/constants/channelMonitor'

export interface CreateChannelMonitorTemplateRequest {
  name: string
  provider: Provider
  api_mode?: APIMode
  description?: string
  extra_headers?: Record<string, string>
  body_override_mode?: BodyOverrideMode
  body_override?: Record<string, unknown> | null
}
