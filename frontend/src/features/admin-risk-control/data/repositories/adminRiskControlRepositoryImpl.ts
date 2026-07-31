/**
 * AdminRiskControlRepositoryImpl. Auto-generated from adminRiskControlDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-risk-control/data/datasources/adminRiskControlDatasource'
import type { AdminRiskControlRepository } from '@/features/admin-risk-control/domain/repositories/adminRiskControlRepository'

export class AdminRiskControlRepositoryImpl implements AdminRiskControlRepository {
  get getConfig(): typeof ds.getConfig { return ds.getConfig }
  get updateConfig(): typeof ds.updateConfig { return ds.updateConfig }
  get getStatus(): typeof ds.getStatus { return ds.getStatus }
  get testAPIKeys(): typeof ds.testAPIKeys { return ds.testAPIKeys }
  get listLogs(): typeof ds.listLogs { return ds.listLogs }
  get unbanUser(): typeof ds.unbanUser { return ds.unbanUser }
  get deleteFlaggedHash(): typeof ds.deleteFlaggedHash { return ds.deleteFlaggedHash }
  get clearFlaggedHashes(): typeof ds.clearFlaggedHashes { return ds.clearFlaggedHashes }
}

export const adminRiskControlRepository: AdminRiskControlRepository = new AdminRiskControlRepositoryImpl()
