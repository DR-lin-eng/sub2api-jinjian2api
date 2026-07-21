/**
 * AdminRiskControlRepositoryImpl. Auto-generated from adminRiskControlDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-risk-control/data/datasources/adminRiskControlDatasource'
import type { AdminRiskControlRepository } from '@/features/admin-risk-control/domain/repositories/adminRiskControlRepository'

export class AdminRiskControlRepositoryImpl implements AdminRiskControlRepository {
  getConfig = ds.getConfig
  updateConfig = ds.updateConfig
  getStatus = ds.getStatus
  testAPIKeys = ds.testAPIKeys
  listLogs = ds.listLogs
  unbanUser = ds.unbanUser
  deleteFlaggedHash = ds.deleteFlaggedHash
  clearFlaggedHashes = ds.clearFlaggedHashes
}

export const adminRiskControlRepository: AdminRiskControlRepository = new AdminRiskControlRepositoryImpl()
