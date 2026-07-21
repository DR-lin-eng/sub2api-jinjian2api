/**
 * ScheduledTestsRepositoryImpl. Auto-generated from scheduledTestsDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-accounts/data/datasources/scheduledTestsDatasource'
import type { ScheduledTestsRepository } from '@/features/admin-accounts/domain/repositories/scheduledTestsRepository'

export class ScheduledTestsRepositoryImpl implements ScheduledTestsRepository {
  get listByAccount(): typeof ds.listByAccount { return ds.listByAccount }
  get create(): typeof ds.create { return ds.create }
  get update(): typeof ds.update { return ds.update }
  get deletePlan(): typeof ds.deletePlan { return ds.deletePlan }
  get listResults(): typeof ds.listResults { return ds.listResults }
}

export const scheduledTestsRepository: ScheduledTestsRepository = new ScheduledTestsRepositoryImpl()
