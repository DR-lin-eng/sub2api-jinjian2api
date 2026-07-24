import { apiClient } from '@/core/networks/client'
import { UserAvailableChannelDto } from '@/features/channels-user/data/models/userAvailableChannelDto'

export class ChannelsUserQueryDatasource {
  async getAvailable(options?: { signal?: AbortSignal }): Promise<UserAvailableChannelDto[]> {
    const { data } = await apiClient.get<unknown[]>('/channels/available', {
      signal: options?.signal,
    })
    return (data ?? []).map(item => UserAvailableChannelDto.fromJson(item))
  }
}

export const channelsUserQueryDatasource = new ChannelsUserQueryDatasource()
