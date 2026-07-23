import type { MonitorStatus } from '@/core/constants/channelMonitor'

export class ExtraModelStatus {
  model!: string
  status!: MonitorStatus | ''
  latencyMs!: number | null
}
