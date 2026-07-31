import type { MonitorStatus } from '@/core/constants/channelMonitor'

export class MonitorTimelinePoint {
  status!: MonitorStatus
  latencyMs!: number
  pingLatencyMs!: number
  checkedAt!: string
}
