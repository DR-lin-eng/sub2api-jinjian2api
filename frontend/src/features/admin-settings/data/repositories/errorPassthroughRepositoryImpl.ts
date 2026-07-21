/**
 * ErrorPassthroughRepositoryImpl. Auto-generated from errorPassthroughDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-settings/data/datasources/errorPassthroughDatasource'
import type { ErrorPassthroughRepository } from '@/features/admin-settings/domain/repositories/errorPassthroughRepository'

export class ErrorPassthroughRepositoryImpl implements ErrorPassthroughRepository {
  list = ds.list
  getById = ds.getById
  create = ds.create
  update = ds.update
  deleteRule = ds.deleteRule
  toggleEnabled = ds.toggleEnabled
}

export const errorPassthroughRepository: ErrorPassthroughRepository = new ErrorPassthroughRepositoryImpl()
