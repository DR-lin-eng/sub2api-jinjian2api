import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { keysQueryDatasource } from '@/features/keys/data/datasources/keysQueryDatasource'
import type { ApiKey } from '@/features/keys/domain/models/apiKey'
import type { KeysQueryRepository } from '@/features/keys/domain/repositories/keysQueryRepository'

export class KeysQueryRepositoryImpl implements KeysQueryRepository {
  private readonly ds = keysQueryDatasource

  async list(
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      search?: string
      status?: string
      group_id?: number | string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<ApiKey>> {
    const dtoPage = await this.ds.list(page, pageSize, filters, options)
    return { ...dtoPage, items: dtoPage.items.map(dto => dto.toEntity()) }
  }

  async getById(id: number): Promise<ApiKey> {
    return (await this.ds.getById(id)).toEntity()
  }
}

export const keysQueryRepository: KeysQueryRepository = new KeysQueryRepositoryImpl()
