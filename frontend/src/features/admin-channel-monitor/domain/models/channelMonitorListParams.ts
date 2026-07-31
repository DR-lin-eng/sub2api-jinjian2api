import type { Provider } from '@/core/constants/channelMonitor'

export class ChannelMonitorListParams {
  page?: number
  pageSize?: number
  provider?: Provider
  enabled?: boolean
  search?: string
}
