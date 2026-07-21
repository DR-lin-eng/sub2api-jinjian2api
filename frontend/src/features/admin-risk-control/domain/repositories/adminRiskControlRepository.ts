/**
 * AdminRiskControlRepository (interface). Auto-generated from adminRiskControlDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminRiskControlRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/admin-risk-control/data/datasources/adminRiskControlDatasource'

export type AdminRiskControlRepository = {
  getConfig: typeof ds.getConfig
  updateConfig: typeof ds.updateConfig
  getStatus: typeof ds.getStatus
  testAPIKeys: typeof ds.testAPIKeys
  listLogs: typeof ds.listLogs
  unbanUser: typeof ds.unbanUser
  deleteFlaggedHash: typeof ds.deleteFlaggedHash
  clearFlaggedHashes: typeof ds.clearFlaggedHashes
}
