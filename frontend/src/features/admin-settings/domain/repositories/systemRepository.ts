/**
 * SystemRepository (interface). Auto-generated from systemDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/systemRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-settings/data/datasources/systemDatasource'

export type SystemRepository = {
  getVersion: typeof ds.getVersion
  checkUpdates: typeof ds.checkUpdates
  getRollbackVersions: typeof ds.getRollbackVersions
  performUpdate: typeof ds.performUpdate
  rollback: typeof ds.rollback
  restartService: typeof ds.restartService
}
