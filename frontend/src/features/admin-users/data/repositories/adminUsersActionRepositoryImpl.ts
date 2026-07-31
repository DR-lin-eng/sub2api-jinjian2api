import type { AdminUser } from '@/features/admin-users/domain/models/adminUser'
import type { AdminBoundAuthIdentity } from '@/features/admin-users/domain/models/adminBoundAuthIdentity'
import type { PlatformQuotaItem } from '@/features/admin-users/domain/models/platformQuotaItem'
import type { AdminUsersActionRepository } from '@/features/admin-users/domain/repositories/adminUsersActionRepository'
import type { CreateAdminUserRequest } from '@/features/admin-users/data/requests_models/createAdminUserRequest'
import type { UpdateAdminUserRequest } from '@/features/admin-users/data/requests_models/updateAdminUserRequest'
import type { UpdateUserBalanceRequest } from '@/features/admin-users/data/requests_models/updateUserBalanceRequest'
import type { BatchUpdateUserLimitsRequest } from '@/features/admin-users/data/requests_models/batchUpdateUserLimitsRequest'
import type { ReplaceUserGroupRequest } from '@/features/admin-users/data/requests_models/replaceUserGroupRequest'
import type { BindAdminAuthIdentityRequest } from '@/features/admin-users/data/requests_models/bindAdminAuthIdentityRequest'
import type { UpdatePlatformQuotasRequest } from '@/features/admin-users/data/requests_models/updatePlatformQuotasRequest'
import type { ResetPlatformQuotaWindowRequest } from '@/features/admin-users/data/requests_models/resetPlatformQuotaWindowRequest'
import { adminUsersActionDatasource } from '@/features/admin-users/data/datasources/adminUsersActionDatasource'

export class AdminUsersActionRepositoryImpl implements AdminUsersActionRepository {
  private readonly ds = adminUsersActionDatasource

  create = async (req: CreateAdminUserRequest) : Promise<AdminUser>  => {
    return (await this.ds.create(req)).toEntity()
  }

  update = async (id: number, req: UpdateAdminUserRequest) : Promise<AdminUser>  => {
    return (await this.ds.update(id, req)).toEntity()
  }

  deleteUser = async (id: number) : Promise<{ message: string }>  => {
    return this.ds.deleteUser(id)
  }

  updateBalance = async (id: number, req: UpdateUserBalanceRequest) : Promise<AdminUser>  => {
    return (await this.ds.updateBalance(id, req)).toEntity()
  }

  batchUpdateLimits = async (req: BatchUpdateUserLimitsRequest) : Promise<{ affected: number }>  => {
    return this.ds.batchUpdateLimits(req)
  }

  replaceGroup = async (userId: number, req: ReplaceUserGroupRequest) : Promise<{ migratedKeys: number }>  => {
    return this.ds.replaceGroup(userId, req)
  }

  bindUserAuthIdentity = async (userId: number, req: BindAdminAuthIdentityRequest) : Promise<AdminBoundAuthIdentity>  => {
    return (await this.ds.bindUserAuthIdentity(userId, req)).toEntity()
  }

  updatePlatformQuotas = async (id: number, req: UpdatePlatformQuotasRequest) : Promise<PlatformQuotaItem[]>  => {
    return (await this.ds.updatePlatformQuotas(id, req)).map(dto => dto.toEntity())
  }

  resetPlatformQuotaWindow = async (id: number, req: ResetPlatformQuotaWindowRequest) : Promise<PlatformQuotaItem[]>  => {
    return (await this.ds.resetPlatformQuotaWindow(id, req)).map(dto => dto.toEntity())
  }
}

export const adminUsersActionRepository: AdminUsersActionRepository = new AdminUsersActionRepositoryImpl()
