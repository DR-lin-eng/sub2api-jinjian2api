import type { AdminUser } from '@/features/admin-users/domain/models/adminUser'
import type { AdminBoundAuthIdentity } from '@/features/admin-users/domain/models/adminBoundAuthIdentity'
import type { PlatformQuotaItem } from '@/features/admin-users/domain/models/platformQuotaItem'
import type { CreateAdminUserRequest } from '@/features/admin-users/data/requests_models/createAdminUserRequest'
import type { UpdateAdminUserRequest } from '@/features/admin-users/data/requests_models/updateAdminUserRequest'
import type { UpdateUserBalanceRequest } from '@/features/admin-users/data/requests_models/updateUserBalanceRequest'
import type { BatchUpdateUserLimitsRequest } from '@/features/admin-users/data/requests_models/batchUpdateUserLimitsRequest'
import type { ReplaceUserGroupRequest } from '@/features/admin-users/data/requests_models/replaceUserGroupRequest'
import type { BindAdminAuthIdentityRequest } from '@/features/admin-users/data/requests_models/bindAdminAuthIdentityRequest'
import type { UpdatePlatformQuotasRequest } from '@/features/admin-users/data/requests_models/updatePlatformQuotasRequest'
import type { ResetPlatformQuotaWindowRequest } from '@/features/admin-users/data/requests_models/resetPlatformQuotaWindowRequest'

export interface AdminUsersActionRepository {
  create(req: CreateAdminUserRequest): Promise<AdminUser>
  update(id: number, req: UpdateAdminUserRequest): Promise<AdminUser>
  deleteUser(id: number): Promise<{ message: string }>
  updateBalance(id: number, req: UpdateUserBalanceRequest): Promise<AdminUser>
  batchUpdateLimits(req: BatchUpdateUserLimitsRequest): Promise<{ affected: number }>
  replaceGroup(userId: number, req: ReplaceUserGroupRequest): Promise<{ migratedKeys: number }>
  bindUserAuthIdentity(userId: number, req: BindAdminAuthIdentityRequest): Promise<AdminBoundAuthIdentity>
  updatePlatformQuotas(id: number, req: UpdatePlatformQuotasRequest): Promise<PlatformQuotaItem[]>
  resetPlatformQuotaWindow(id: number, req: ResetPlatformQuotaWindowRequest): Promise<PlatformQuotaItem[]>
}
