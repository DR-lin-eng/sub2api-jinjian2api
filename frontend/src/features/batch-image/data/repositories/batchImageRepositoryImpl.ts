/**
 * BatchImageRepositoryImpl. Auto-generated from batchImageDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/batch-image/data/datasources/batchImageDatasource'
import type { BatchImageRepository } from '@/features/batch-image/domain/repositories/batchImageRepository'

export class BatchImageRepositoryImpl implements BatchImageRepository {
  submitBatchImageJob = ds.submitBatchImageJob
  getBatchImageJob = ds.getBatchImageJob
  listBatchImageJobs = ds.listBatchImageJobs
  listBatchImageModels = ds.listBatchImageModels
  listBatchImageItems = ds.listBatchImageItems
  cancelBatchImageJob = ds.cancelBatchImageJob
  downloadBatchImageZip = ds.downloadBatchImageZip
  getBatchImageItemContent = ds.getBatchImageItemContent
  deleteBatchImageJobRecord = ds.deleteBatchImageJobRecord
  saveBlob = ds.saveBlob
}

export const batchImageRepository: BatchImageRepository = new BatchImageRepositoryImpl()
