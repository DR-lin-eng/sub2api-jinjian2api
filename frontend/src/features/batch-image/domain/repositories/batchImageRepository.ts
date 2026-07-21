/**
 * BatchImageRepository (interface). Auto-generated from batchImageDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/batchImageRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/batch-image/data/datasources/batchImageDatasource'

export type BatchImageRepository = {
  submitBatchImageJob: typeof ds.submitBatchImageJob
  getBatchImageJob: typeof ds.getBatchImageJob
  listBatchImageJobs: typeof ds.listBatchImageJobs
  listBatchImageModels: typeof ds.listBatchImageModels
  listBatchImageItems: typeof ds.listBatchImageItems
  cancelBatchImageJob: typeof ds.cancelBatchImageJob
  downloadBatchImageZip: typeof ds.downloadBatchImageZip
  getBatchImageItemContent: typeof ds.getBatchImageItemContent
  deleteBatchImageJobRecord: typeof ds.deleteBatchImageJobRecord
  saveBlob: typeof ds.saveBlob
}
