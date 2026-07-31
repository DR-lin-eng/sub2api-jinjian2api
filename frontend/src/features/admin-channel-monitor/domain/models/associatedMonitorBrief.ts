import type { APIMode, Provider } from '@/core/constants/channelMonitor'

export class AssociatedMonitorBrief {
  id!: number
  name!: string
  provider!: Provider
  apiMode!: APIMode
  enabled!: boolean
}
