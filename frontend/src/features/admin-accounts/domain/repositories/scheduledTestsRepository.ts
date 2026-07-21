/**
 * ScheduledTestsRepository (interface). Auto-generated from scheduledTestsDatasource.ts.
 */
import type * as ds from '@/features/admin-accounts/data/datasources/scheduledTestsDatasource'

export type ScheduledTestsRepository = {
  readonly listByAccount: typeof ds.listByAccount
  readonly create: typeof ds.create
  readonly update: typeof ds.update
  readonly deletePlan: typeof ds.deletePlan
  readonly listResults: typeof ds.listResults
}
