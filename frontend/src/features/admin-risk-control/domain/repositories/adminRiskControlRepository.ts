/**
 * AdminRiskControlRepository (interface). Auto-generated from adminRiskControlDatasource.ts.
 */
import type * as ds from '@/features/admin-risk-control/data/datasources/adminRiskControlDatasource'

export type AdminRiskControlRepository = {
  readonly getConfig: typeof ds.getConfig
  readonly updateConfig: typeof ds.updateConfig
  readonly getStatus: typeof ds.getStatus
  readonly testAPIKeys: typeof ds.testAPIKeys
  readonly listLogs: typeof ds.listLogs
  readonly unbanUser: typeof ds.unbanUser
  readonly deleteFlaggedHash: typeof ds.deleteFlaggedHash
  readonly clearFlaggedHashes: typeof ds.clearFlaggedHashes
}
