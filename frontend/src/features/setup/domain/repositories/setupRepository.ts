/**
 * SetupRepository (interface). Auto-generated from setupDatasource.ts.
 */
import type * as ds from '@/features/setup/data/datasources/setupDatasource'

export type SetupRepository = {
  readonly getSetupStatus: typeof ds.getSetupStatus
  readonly testDatabase: typeof ds.testDatabase
  readonly testRedis: typeof ds.testRedis
  readonly install: typeof ds.install
}
