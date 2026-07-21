/**
 * BatchImageRepositoryImpl. Auto-generated from batchImageDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/batch-image/data/datasources/batchImageDatasource'
import type { BatchImageRepository } from '@/features/batch-image/domain/repositories/batchImageRepository'

export class BatchImageRepositoryImpl implements BatchImageRepository {
  get submitBatchImageJob(): typeof ds.submitBatchImageJob { return ds.submitBatchImageJob }
  get getBatchImageJob(): typeof ds.getBatchImageJob { return ds.getBatchImageJob }
  get listBatchImageJobs(): typeof ds.listBatchImageJobs { return ds.listBatchImageJobs }
  get listBatchImageModels(): typeof ds.listBatchImageModels { return ds.listBatchImageModels }
  get listBatchImageItems(): typeof ds.listBatchImageItems { return ds.listBatchImageItems }
  get cancelBatchImageJob(): typeof ds.cancelBatchImageJob { return ds.cancelBatchImageJob }
  get downloadBatchImageZip(): typeof ds.downloadBatchImageZip { return ds.downloadBatchImageZip }
  get getBatchImageItemContent(): typeof ds.getBatchImageItemContent { return ds.getBatchImageItemContent }
  get deleteBatchImageJobRecord(): typeof ds.deleteBatchImageJobRecord { return ds.deleteBatchImageJobRecord }
  get saveBlob(): typeof ds.saveBlob { return ds.saveBlob }
}

export const batchImageRepository: BatchImageRepository = new BatchImageRepositoryImpl()
