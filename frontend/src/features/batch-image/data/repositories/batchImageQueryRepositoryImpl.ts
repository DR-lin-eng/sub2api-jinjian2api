import { batchImageQueryDatasource } from '@/features/batch-image/data/datasources/batchImageQueryDatasource'
import type { BatchImageQueryRepository, BatchImageJobsPage, BatchImageItemsPage } from '@/features/batch-image/domain/repositories/batchImageQueryRepository'
import type { BatchImageJob } from '@/features/batch-image/domain/models/batchImageJob'
import type { BatchImageModel } from '@/features/batch-image/domain/models/batchImageModel'
import type { ListBatchImageJobsRequest } from '@/features/batch-image/data/requests_models/listBatchImageJobsRequest'

class BatchImageQueryRepositoryImpl implements BatchImageQueryRepository {
  private readonly ds = batchImageQueryDatasource

  async getById(apiKey: string, batchId: string): Promise<BatchImageJob> {
    return (await this.ds.getById(apiKey, batchId)).toEntity()
  }

  async list(apiKey: string, options?: ListBatchImageJobsRequest): Promise<BatchImageJobsPage> {
    const result = await this.ds.list(apiKey, options)
    return { data: result.data.map(dto => dto.toEntity()), has_more: result.has_more }
  }

  async listModels(apiKey: string): Promise<BatchImageModel[]> {
    const result = await this.ds.listModels(apiKey)
    return result.data.map(dto => dto.toEntity())
  }

  async listItems(apiKey: string, batchId: string, status?: string): Promise<BatchImageItemsPage> {
    const result = await this.ds.listItems(apiKey, batchId, status)
    return { data: result.data.map(dto => dto.toEntity()), has_more: result.has_more }
  }

  async getItemContent(apiKey: string, batchId: string, customId: string, imageIndex?: number): Promise<Blob> {
    return this.ds.getItemContent(apiKey, batchId, customId, imageIndex)
  }
}

export const batchImageQueryRepository: BatchImageQueryRepository = new BatchImageQueryRepositoryImpl()
