import { apiClient } from '@/core/networks/client'
import { UserMonitorViewDto } from '@/features/channel-monitor-user/data/models/userMonitorViewDto'

export class ChannelMonitorUserQueryDatasource {
  async list(options?: { signal?: AbortSignal }): Promise<UserMonitorViewDto[]> {
    const { data } = await apiClient.get<{ items: unknown[] }>('/channel-monitors', {
      signal: options?.signal,
    })
    return (data.items ?? []).map(item => UserMonitorViewDto.fromJson(item))
  }
}

export const channelMonitorUserQueryDatasource = new ChannelMonitorUserQueryDatasource()
