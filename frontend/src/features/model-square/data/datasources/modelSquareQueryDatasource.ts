import { apiClient } from '@/core/networks/client'
import { ModelSquareItemDto } from '@/features/model-square/data/models/modelSquareItemDto'

export class ModelSquareQueryDatasource {
  async list(options?: { signal?: AbortSignal }): Promise<ModelSquareItemDto[]> {
    const { data } = await apiClient.get<unknown[]>('/models/catalog', {
      signal: options?.signal,
    })
    return (data ?? []).map(item => ModelSquareItemDto.fromJson(item))
  }
}

export const modelSquareQueryDatasource = new ModelSquareQueryDatasource()
