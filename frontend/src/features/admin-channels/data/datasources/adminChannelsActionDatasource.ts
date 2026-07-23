import { apiClient } from '@/core/networks/client'
import { ChannelDto } from '@/features/admin-channels/data/models/channelDto'
import { SyncPricingModelsResultDto } from '@/features/admin-channels/data/models/syncPricingModelsResultDto'
import type { CreateChannelRequest } from '@/features/admin-channels/data/requests_models/createChannelRequest'
import type { UpdateChannelRequest } from '@/features/admin-channels/data/requests_models/updateChannelRequest'

export class AdminChannelsActionDatasource {
  async create(req: CreateChannelRequest): Promise<ChannelDto> {
    const { data } = await apiClient.post<unknown>('/admin/channels', req)
    return ChannelDto.fromJson(data)
  }

  async update(id: number, req: UpdateChannelRequest): Promise<ChannelDto> {
    const { data } = await apiClient.put<unknown>(`/admin/channels/${id}`, req)
    return ChannelDto.fromJson(data)
  }

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/admin/channels/${id}`)
  }

  async syncPricingModels(platform: string): Promise<SyncPricingModelsResultDto> {
    const { data } = await apiClient.get<unknown>('/admin/channels/pricing/sync-models', {
      params: { platform },
    })
    return SyncPricingModelsResultDto.fromJson(data)
  }
}

export const adminChannelsActionDatasource = new AdminChannelsActionDatasource()
