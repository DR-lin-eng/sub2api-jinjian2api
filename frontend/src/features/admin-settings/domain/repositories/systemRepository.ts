/**
 * SystemRepository (interface). Auto-generated from systemDatasource.ts.
 */
import type * as ds from '@/features/admin-settings/data/datasources/systemDatasource'

export type SystemRepository = {
  readonly getVersion: typeof ds.getVersion
  readonly checkUpdates: typeof ds.checkUpdates
  readonly getRollbackVersions: typeof ds.getRollbackVersions
  readonly performUpdate: typeof ds.performUpdate
  readonly rollback: typeof ds.rollback
  readonly restartService: typeof ds.restartService
}
