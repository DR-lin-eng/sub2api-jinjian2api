/**
 * Keys Query Datasource — GET endpoints only.
 * Returns Dto instances (via Dto.fromJson) to Impl. No transformation beyond that.
 */
import { apiClient } from '@/core/networks/client'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { ApiKeyDto } from '@/core/models/data/apiKeyDto'

export class KeysQueryDatasource {
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
  ): Promise<PaginatedResponse<ApiKeyDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/keys', {
      params: { page, page_size: pageSize, ...filters },
      signal: options?.signal,
    })
    return { ...data, items: (data.items ?? []).map(item => ApiKeyDto.fromJson(item)) }
  }

  async getById(id: number): Promise<ApiKeyDto> {
    const { data } = await apiClient.get<unknown>(`/keys/${id}`)
    return ApiKeyDto.fromJson(data)
  }
}

export const keysQueryDatasource = new KeysQueryDatasource()
