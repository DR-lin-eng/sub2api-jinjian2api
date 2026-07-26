/**
 * KeysQueryRepository (interface). Per spec §5.2 R4.
 */
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import type { ApiKey } from '@/core/models/domain/apiKey'

export interface KeysQueryRepository {
  list(
    page?: number,
    pageSize?: number,
    filters?: {
      search?: string
      status?: string
      group_id?: number | string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<ApiKey>>
  getById(id: number): Promise<ApiKey>
}
