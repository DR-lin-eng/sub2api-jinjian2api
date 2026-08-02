import { modelPlazaQueryDatasource } from '@/features/model-plaza/data/datasources/modelPlazaQueryDatasource'
import type { ModelPlazaResponse } from '@/features/model-plaza/domain/models/modelPlazaResponse'
import type { ModelPlazaQueryRepository } from '@/features/model-plaza/domain/repositories/modelPlazaQueryRepository'

export class ModelPlazaQueryRepositoryImpl implements ModelPlazaQueryRepository {
  private readonly datasource = modelPlazaQueryDatasource

  async get(options?: { signal?: AbortSignal }): Promise<ModelPlazaResponse> {
    const dto = await this.datasource.get(options)
    return dto.toEntity()
  }
}

export const modelPlazaQueryRepository: ModelPlazaQueryRepository = new ModelPlazaQueryRepositoryImpl()
