/**
 * AdminUsersRepositoryImpl. Auto-generated from adminUsersDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-users/data/datasources/adminUsersDatasource'
import type { AdminUsersRepository } from '@/features/admin-users/domain/repositories/adminUsersRepository'

export class AdminUsersRepositoryImpl implements AdminUsersRepository {
  get list(): typeof ds.list { return ds.list }
  get getById(): typeof ds.getById { return ds.getById }
  get create(): typeof ds.create { return ds.create }
  get update(): typeof ds.update { return ds.update }
  get deleteUser(): typeof ds.deleteUser { return ds.deleteUser }
  get updateBalance(): typeof ds.updateBalance { return ds.updateBalance }
  get updateConcurrency(): typeof ds.updateConcurrency { return ds.updateConcurrency }
  get batchUpdateLimits(): typeof ds.batchUpdateLimits { return ds.batchUpdateLimits }
  get toggleStatus(): typeof ds.toggleStatus { return ds.toggleStatus }
  get getUserApiKeys(): typeof ds.getUserApiKeys { return ds.getUserApiKeys }
  get getUserUsageStats(): typeof ds.getUserUsageStats { return ds.getUserUsageStats }
  get getUserBalanceHistory(): typeof ds.getUserBalanceHistory { return ds.getUserBalanceHistory }
  get replaceGroup(): typeof ds.replaceGroup { return ds.replaceGroup }
  get bindUserAuthIdentity(): typeof ds.bindUserAuthIdentity { return ds.bindUserAuthIdentity }
  get getPlatformQuotas(): typeof ds.getPlatformQuotas { return ds.getPlatformQuotas }
  get getBatchPlatformQuotas(): typeof ds.getBatchPlatformQuotas { return ds.getBatchPlatformQuotas }
  get updatePlatformQuotas(): typeof ds.updatePlatformQuotas { return ds.updatePlatformQuotas }
  get resetPlatformQuotaWindow(): typeof ds.resetPlatformQuotaWindow { return ds.resetPlatformQuotaWindow }
}

export const adminUsersRepository: AdminUsersRepository = new AdminUsersRepositoryImpl()
