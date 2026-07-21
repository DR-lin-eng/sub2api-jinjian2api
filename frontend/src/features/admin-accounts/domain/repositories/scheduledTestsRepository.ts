/**
 * ScheduledTestsRepository (interface). Auto-generated from scheduledTestsDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/scheduledTestsRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-accounts/data/datasources/scheduledTestsDatasource'

export type ScheduledTestsRepository = {
  listByAccount: typeof ds.listByAccount
  create: typeof ds.create
  update: typeof ds.update
  deletePlan: typeof ds.deletePlan
  listResults: typeof ds.listResults
}
