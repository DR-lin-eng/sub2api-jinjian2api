import { apiClient } from '@/core/networks/client'
import { ModelPlazaResponseDto } from '@/features/model-plaza/data/models/modelPlazaResponseDto'

export class ModelPlazaQueryDatasource {
  async get(options?: { signal?: AbortSignal }): Promise<ModelPlazaResponseDto> {
    const { data } = await apiClient.get<unknown>('/model-plaza', {
      signal: options?.signal,
    })
    return ModelPlazaResponseDto.fromJson(data)
  }
}

export const modelPlazaQueryDatasource = new ModelPlazaQueryDatasource()
