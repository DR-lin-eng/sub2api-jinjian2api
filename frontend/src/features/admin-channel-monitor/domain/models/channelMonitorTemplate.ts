import type { APIMode, BodyOverrideMode, Provider } from '@/core/constants/channelMonitor'

export class ChannelMonitorTemplate {
  id!: number
  name!: string
  provider!: Provider
  apiMode!: APIMode
  description!: string
  extraHeaders!: Record<string, string>
  bodyOverrideMode!: BodyOverrideMode
  bodyOverride!: Record<string, unknown> | null
  createdAt!: string
  updatedAt!: string
  associatedMonitors!: number
}
