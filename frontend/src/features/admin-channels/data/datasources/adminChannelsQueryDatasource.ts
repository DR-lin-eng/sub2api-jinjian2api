import { apiClient } from '@/core/networks/client'
import type { PaginatedResponse } from '@/types'
import { ChannelDto } from '@/features/admin-channels/data/models/channelDto'
import { ModelDefaultPricingDto } from '@/features/admin-channels/data/models/modelDefaultPricingDto'

export interface AdminChannelsListFilters {
  status?: string
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export class AdminChannelsQueryDatasource {
  async list(
    page: number = 1,
    pageSize: number = 20,
    filters?: AdminChannelsListFilters,
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<ChannelDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/channels', {
      params: { page, page_size: pageSize, ...filters },
      signal: options?.signal,
    })
    return { ...data, items: (data.items ?? []).map(item => ChannelDto.fromJson(item)) }
  }

  async getById(id: number): Promise<ChannelDto> {
    const { data } = await apiClient.get<unknown>(`/admin/channels/${id}`)
    return ChannelDto.fromJson(data)
  }

  async getModelDefaultPricing(model: string): Promise<ModelDefaultPricingDto> {
    const { data } = await apiClient.get<unknown>('/admin/channels/model-pricing', {
      params: { model },
    })
    return ModelDefaultPricingDto.fromJson(data)
  }
}

export const adminChannelsQueryDatasource = new AdminChannelsQueryDatasource()
