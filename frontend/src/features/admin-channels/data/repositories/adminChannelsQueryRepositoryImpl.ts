import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { adminChannelsQueryDatasource } from '@/features/admin-channels/data/datasources/adminChannelsQueryDatasource'
import type { Channel } from '@/features/admin-channels/domain/models/channel'
import type { ModelDefaultPricing } from '@/features/admin-channels/domain/models/modelDefaultPricing'
import type {
  AdminChannelsQueryRepository,
  AdminChannelsListFilters,
} from '@/features/admin-channels/domain/repositories/adminChannelsQueryRepository'

export class AdminChannelsQueryRepositoryImpl implements AdminChannelsQueryRepository {
  private readonly ds = adminChannelsQueryDatasource

  async list(
    page: number = 1,
    pageSize: number = 20,
    filters?: AdminChannelsListFilters,
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<Channel>> {
    const dtoPage = await this.ds.list(page, pageSize, filters, options)
    return { ...dtoPage, items: dtoPage.items.map(dto => dto.toEntity()) }
  }

  async getById(id: number): Promise<Channel> {
    return (await this.ds.getById(id)).toEntity()
  }

  async getModelDefaultPricing(model: string): Promise<ModelDefaultPricing> {
    return (await this.ds.getModelDefaultPricing(model)).toEntity()
  }
}

export const adminChannelsQueryRepository: AdminChannelsQueryRepository = new AdminChannelsQueryRepositoryImpl()
