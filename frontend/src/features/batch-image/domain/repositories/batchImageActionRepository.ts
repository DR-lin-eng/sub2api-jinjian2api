import type { BatchImageJob } from '@/features/batch-image/domain/models/batchImageJob'
import type { SubmitBatchImageJobRequest } from '@/features/batch-image/data/requests_models/submitBatchImageJobRequest'

export interface BatchImageActionRepository {
  submit(apiKey: string, req: SubmitBatchImageJobRequest, idempotencyKey: string): Promise<BatchImageJob>
  cancel(apiKey: string, batchId: string): Promise<BatchImageJob>
  downloadZip(apiKey: string, batchId: string): Promise<Blob>
  deleteRecord(apiKey: string, batchId: string): Promise<void>
  saveBlob(blob: Blob, filename: string): void
}
