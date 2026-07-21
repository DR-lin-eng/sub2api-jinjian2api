/**
 * BatchImageRepository (interface). Auto-generated from batchImageDatasource.ts.
 */
import type * as ds from '@/features/batch-image/data/datasources/batchImageDatasource'

export type BatchImageRepository = {
  readonly submitBatchImageJob: typeof ds.submitBatchImageJob
  readonly getBatchImageJob: typeof ds.getBatchImageJob
  readonly listBatchImageJobs: typeof ds.listBatchImageJobs
  readonly listBatchImageModels: typeof ds.listBatchImageModels
  readonly listBatchImageItems: typeof ds.listBatchImageItems
  readonly cancelBatchImageJob: typeof ds.cancelBatchImageJob
  readonly downloadBatchImageZip: typeof ds.downloadBatchImageZip
  readonly getBatchImageItemContent: typeof ds.getBatchImageItemContent
  readonly deleteBatchImageJobRecord: typeof ds.deleteBatchImageJobRecord
  readonly saveBlob: typeof ds.saveBlob
}
