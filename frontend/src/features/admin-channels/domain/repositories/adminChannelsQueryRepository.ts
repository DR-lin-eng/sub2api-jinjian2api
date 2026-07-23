import type { PaginatedResponse } from '@/types'
import type { Channel } from '@/features/admin-channels/domain/models/channel'
import type { ModelDefaultPricing } from '@/features/admin-channels/domain/models/modelDefaultPricing'

export interface AdminChannelsListFilters {
  status?: string
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface AdminChannelsQueryRepository {
  list(
    page?: number,
    pageSize?: number,
    filters?: AdminChannelsListFilters,
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<Channel>>
  getById(id: number): Promise<Channel>
  getModelDefaultPricing(model: string): Promise<ModelDefaultPricing>
}
