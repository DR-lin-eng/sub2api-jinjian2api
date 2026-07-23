import type { Provider, MonitorMode, MonitorStatus } from '@/core/constants/channelMonitor'

export type { Provider, MonitorMode, MonitorStatus }

export interface UserMonitorExtraModelEntity {
  model: string
  status: MonitorStatus
  latencyMs: number | null
}

export interface MonitorTimelinePointEntity {
  status: MonitorStatus
  latencyMs: number | null
  pingLatencyMs: number | null
  checkedAt: string
}

export interface UserMonitorViewEntity {
  id: number
  name: string
  provider: Provider
  monitorMode?: MonitorMode
  groupName: string
  primaryModel: string
  primaryStatus: MonitorStatus
  primaryLatencyMs: number | null
  primaryPingLatencyMs: number | null
  availability7d: number
  extraModels: UserMonitorExtraModelEntity[]
  timeline: MonitorTimelinePointEntity[]
}

export interface UserMonitorModelDetailEntity {
  model: string
  latestStatus: MonitorStatus
  latestLatencyMs: number | null
  availability7d: number
  availability15d: number
  availability30d: number
  avgLatency7dMs: number | null
}

export interface UserMonitorDetailEntity {
  id: number
  name: string
  provider: Provider
  monitorMode?: MonitorMode
  groupName: string
  models: UserMonitorModelDetailEntity[]
}
