import type { ChannelMonitor } from '@/features/admin-channel-monitor/domain/models/channelMonitor'

export class ChannelMonitorListResponse {
  items!: ChannelMonitor[]
  total!: number
  page!: number
  pageSize!: number
  pages!: number
}
