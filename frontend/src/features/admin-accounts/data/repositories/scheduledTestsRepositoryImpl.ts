/**
 * ScheduledTestsRepositoryImpl. Auto-generated from scheduledTestsDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-accounts/data/datasources/scheduledTestsDatasource'
import type { ScheduledTestsRepository } from '@/features/admin-accounts/domain/repositories/scheduledTestsRepository'

export class ScheduledTestsRepositoryImpl implements ScheduledTestsRepository {
  listByAccount = ds.listByAccount
  create = ds.create
  update = ds.update
  deletePlan = ds.deletePlan
  listResults = ds.listResults
}

export const scheduledTestsRepository: ScheduledTestsRepository = new ScheduledTestsRepositoryImpl()
