/**
 * SetupRepositoryImpl. Auto-generated from setupDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/setup/data/datasources/setupDatasource'
import type { SetupRepository } from '@/features/setup/domain/repositories/setupRepository'

export class SetupRepositoryImpl implements SetupRepository {
  getSetupStatus = ds.getSetupStatus
  testDatabase = ds.testDatabase
  testRedis = ds.testRedis
  install = ds.install
}

export const setupRepository: SetupRepository = new SetupRepositoryImpl()
