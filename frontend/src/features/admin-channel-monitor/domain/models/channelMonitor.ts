import type { APIMode, BodyOverrideMode, MonitorMode, MonitorStatus, Provider } from '@/core/constants/channelMonitor'
import type { ExtraModelStatus } from '@/features/admin-channel-monitor/domain/models/extraModelStatus'

export class ChannelMonitor {
  id!: number
  name!: string
  provider!: Provider
  monitorMode!: MonitorMode
  channelId!: number | null
  groupId!: number | null
  apiMode!: APIMode
  endpoint!: string
  apiKeyMasked!: string
  apiKeyDecryptFailed!: boolean
  primaryModel!: string
  extraModels!: string[]
  groupName!: string
  enabled!: boolean
  intervalSeconds!: number
  jitterSeconds!: number
  lastCheckedAt!: string | null
  createdBy!: number
  createdAt!: string
  updatedAt!: string
  primaryStatus!: MonitorStatus | ''
  primaryLatencyMs!: number | null
  availability7d!: number
  extraModelsStatus!: ExtraModelStatus[]
  templateId!: number | null
  extraHeaders!: Record<string, string>
  bodyOverrideMode!: BodyOverrideMode
  bodyOverride!: Record<string, unknown> | null
}
