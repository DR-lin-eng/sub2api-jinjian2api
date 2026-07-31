import type { Provider, MonitorMode, MonitorStatus } from '@/core/constants/channelMonitor'
import type { UserMonitorExtraModel } from './userMonitorExtraModel'
import type { MonitorTimelinePoint } from './monitorTimelinePoint'

export class UserMonitorView {
  id!: number
  name!: string
  provider!: Provider
  monitorMode!: MonitorMode | ''
  groupName!: string
  primaryModel!: string
  primaryStatus!: MonitorStatus
  primaryLatencyMs!: number
  primaryPingLatencyMs!: number
  availability7d!: number
  extraModels!: UserMonitorExtraModel[]
  timeline!: MonitorTimelinePoint[]
}
