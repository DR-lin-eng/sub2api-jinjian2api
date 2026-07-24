import type { MonitorStatus } from '@/core/constants/channelMonitor'

export class UserMonitorModelDetail {
  model!: string
  latestStatus!: MonitorStatus
  latestLatencyMs!: number
  availability7d!: number
  availability15d!: number
  availability30d!: number
  avgLatency7dMs!: number
}
