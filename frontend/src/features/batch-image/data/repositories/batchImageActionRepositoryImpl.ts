import { batchImageActionDatasource } from '@/features/batch-image/data/datasources/batchImageActionDatasource'
import type { BatchImageActionRepository } from '@/features/batch-image/domain/repositories/batchImageActionRepository'
import type { BatchImageJob } from '@/features/batch-image/domain/models/batchImageJob'
import type { SubmitBatchImageJobRequest } from '@/features/batch-image/data/requests_models/submitBatchImageJobRequest'

class BatchImageActionRepositoryImpl implements BatchImageActionRepository {
  private readonly ds = batchImageActionDatasource

  async submit(apiKey: string, req: SubmitBatchImageJobRequest, idempotencyKey: string): Promise<BatchImageJob> {
    return (await this.ds.submit(apiKey, req, idempotencyKey)).toEntity()
  }

  async cancel(apiKey: string, batchId: string): Promise<BatchImageJob> {
    return (await this.ds.cancel(apiKey, batchId)).toEntity()
  }

  async downloadZip(apiKey: string, batchId: string): Promise<Blob> {
    return this.ds.downloadZip(apiKey, batchId)
  }

  async deleteRecord(apiKey: string, batchId: string): Promise<void> {
    return this.ds.deleteRecord(apiKey, batchId)
  }

  saveBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

export const batchImageActionRepository: BatchImageActionRepository = new BatchImageActionRepositoryImpl()
