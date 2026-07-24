import type { BatchImageJob } from '@/features/batch-image/domain/models/batchImageJob'
import type { BatchImageItem } from '@/features/batch-image/domain/models/batchImageItem'
import type { BatchImageModel } from '@/features/batch-image/domain/models/batchImageModel'
import type { ListBatchImageJobsRequest } from '@/features/batch-image/data/requests_models/listBatchImageJobsRequest'

export interface BatchImageJobsPage {
  data: BatchImageJob[]
  has_more: boolean
}

export interface BatchImageItemsPage {
  data: BatchImageItem[]
  has_more: boolean
}

export interface BatchImageQueryRepository {
  getById(apiKey: string, batchId: string): Promise<BatchImageJob>
  list(apiKey: string, options?: ListBatchImageJobsRequest): Promise<BatchImageJobsPage>
  listModels(apiKey: string): Promise<BatchImageModel[]>
  listItems(apiKey: string, batchId: string, status?: string): Promise<BatchImageItemsPage>
  getItemContent(apiKey: string, batchId: string, customId: string, imageIndex?: number): Promise<Blob>
}
