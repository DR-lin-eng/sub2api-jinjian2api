import { modelSquareQueryDatasource } from '@/features/model-square/data/datasources/modelSquareQueryDatasource'
import type { ModelSquareItem } from '@/features/model-square/domain/models/modelSquareItem'
import type { ModelSquareQueryRepository } from '@/features/model-square/domain/repositories/modelSquareQueryRepository'

export class ModelSquareQueryRepositoryImpl implements ModelSquareQueryRepository {
  private readonly datasource = modelSquareQueryDatasource

  async list(options?: { signal?: AbortSignal }): Promise<ModelSquareItem[]> {
    const items = await this.datasource.list(options)
    return items.map(item => item.toEntity())
  }
}

export const modelSquareQueryRepository: ModelSquareQueryRepository = new ModelSquareQueryRepositoryImpl()
