/**
 * SetupRepositoryImpl. Auto-generated from setupDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/setup/data/datasources/setupDatasource'
import type { SetupRepository } from '@/features/setup/domain/repositories/setupRepository'

export class SetupRepositoryImpl implements SetupRepository {
  get getSetupStatus(): typeof ds.getSetupStatus { return ds.getSetupStatus }
  get testDatabase(): typeof ds.testDatabase { return ds.testDatabase }
  get testRedis(): typeof ds.testRedis { return ds.testRedis }
  get install(): typeof ds.install { return ds.install }
}

export const setupRepository: SetupRepository = new SetupRepositoryImpl()
