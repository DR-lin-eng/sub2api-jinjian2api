import type { MonitorStatus } from '@/core/constants/channelMonitor'

export class HistoryItem {
  id!: number
  model!: string
  status!: MonitorStatus
  latencyMs!: number | null
  pingLatencyMs!: number | null
  message!: string
  checkedAt!: string
}
