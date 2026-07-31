import type { MonitorStatus } from '@/core/constants/channelMonitor'

export class UserMonitorExtraModel {
  model!: string
  status!: MonitorStatus
  latencyMs!: number
}
