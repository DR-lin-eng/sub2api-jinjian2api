/**
 * SystemRepositoryImpl. Auto-generated from systemDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-settings/data/datasources/systemDatasource'
import type { SystemRepository } from '@/features/admin-settings/domain/repositories/systemRepository'

export class SystemRepositoryImpl implements SystemRepository {
  getVersion = ds.getVersion
  checkUpdates = ds.checkUpdates
  getRollbackVersions = ds.getRollbackVersions
  performUpdate = ds.performUpdate
  rollback = ds.rollback
  restartService = ds.restartService
}

export const systemRepository: SystemRepository = new SystemRepositoryImpl()
