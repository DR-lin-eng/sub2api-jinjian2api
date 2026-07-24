import { apiClient } from '@/core/networks/client'
import { AdminUserDto } from '@/features/admin-users/data/models/adminUserDto'
import { AdminBoundAuthIdentityDto } from '@/features/admin-users/data/models/adminBoundAuthIdentityDto'
import { PlatformQuotaItemDto } from '@/features/admin-users/data/models/platformQuotaItemDto'
import type { CreateAdminUserRequest } from '@/features/admin-users/data/requests_models/createAdminUserRequest'
import type { UpdateAdminUserRequest } from '@/features/admin-users/data/requests_models/updateAdminUserRequest'
import type { UpdateUserBalanceRequest } from '@/features/admin-users/data/requests_models/updateUserBalanceRequest'
import type { BatchUpdateUserLimitsRequest } from '@/features/admin-users/data/requests_models/batchUpdateUserLimitsRequest'
import type { ReplaceUserGroupRequest } from '@/features/admin-users/data/requests_models/replaceUserGroupRequest'
import type { BindAdminAuthIdentityRequest } from '@/features/admin-users/data/requests_models/bindAdminAuthIdentityRequest'
import type { UpdatePlatformQuotasRequest } from '@/features/admin-users/data/requests_models/updatePlatformQuotasRequest'
import type { ResetPlatformQuotaWindowRequest } from '@/features/admin-users/data/requests_models/resetPlatformQuotaWindowRequest'

export class AdminUsersActionDatasource {
  async create(req: CreateAdminUserRequest): Promise<AdminUserDto> {
    const { data } = await apiClient.post<unknown>('/admin/users', req)
    return AdminUserDto.fromJson(data)
  }

  async update(id: number, req: UpdateAdminUserRequest): Promise<AdminUserDto> {
    const { data } = await apiClient.put<unknown>(`/admin/users/${id}`, req)
    return AdminUserDto.fromJson(data)
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/users/${id}`)
    return data
  }

  async updateBalance(id: number, req: UpdateUserBalanceRequest): Promise<AdminUserDto> {
    const { data } = await apiClient.post<unknown>(`/admin/users/${id}/balance`, req)
    return AdminUserDto.fromJson(data)
  }

  async batchUpdateLimits(req: BatchUpdateUserLimitsRequest): Promise<{ affected: number }> {
    const { data } = await apiClient.post<{ affected: number }>(
      '/admin/users/batch-limits',
      req
    )
    return data
  }

  async replaceGroup(userId: number, req: ReplaceUserGroupRequest): Promise<{ migratedKeys: number }> {
    const { data } = await apiClient.post<{ migrated_keys: number }>(
      `/admin/users/${userId}/replace-group`,
      req
    )
    return { migratedKeys: data.migrated_keys ?? 0 }
  }

  async bindUserAuthIdentity(userId: number, req: BindAdminAuthIdentityRequest): Promise<AdminBoundAuthIdentityDto> {
    const { data } = await apiClient.post<unknown>(
      `/admin/users/${userId}/auth-identities`,
      req
    )
    return AdminBoundAuthIdentityDto.fromJson(data)
  }

  async updatePlatformQuotas(id: number, req: UpdatePlatformQuotasRequest): Promise<PlatformQuotaItemDto[]> {
    const { data } = await apiClient.put<{ platform_quotas: unknown[] }>(
      `/admin/users/${id}/platform-quotas`,
      req
    )
    return (data.platform_quotas ?? []).map(item => PlatformQuotaItemDto.fromJson(item))
  }

  async resetPlatformQuotaWindow(id: number, req: ResetPlatformQuotaWindowRequest): Promise<PlatformQuotaItemDto[]> {
    const { data } = await apiClient.post<{ platform_quotas: unknown[] }>(
      `/admin/users/${id}/platform-quotas/reset`,
      req
    )
    return (data.platform_quotas ?? []).map(item => PlatformQuotaItemDto.fromJson(item))
  }
}

export const adminUsersActionDatasource = new AdminUsersActionDatasource()
