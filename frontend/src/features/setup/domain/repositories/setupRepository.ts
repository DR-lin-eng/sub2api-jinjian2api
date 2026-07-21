/**
 * SetupRepository (interface). Auto-generated from setupDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/setupRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/setup/data/datasources/setupDatasource'

export type SetupRepository = {
  getSetupStatus: typeof ds.getSetupStatus
  testDatabase: typeof ds.testDatabase
  testRedis: typeof ds.testRedis
  install: typeof ds.install
}
