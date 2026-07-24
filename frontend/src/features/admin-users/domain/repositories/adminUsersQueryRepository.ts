import type { PaginatedResponse } from '@/types'
import type { AdminUser } from '@/features/admin-users/domain/models/adminUser'
import type { AdminUserUsageStats } from '@/features/admin-users/domain/models/adminUserUsageStats'
import type { BalanceHistoryPage } from '@/features/admin-users/domain/models/balanceHistoryPage'
import type { PlatformQuotaItem } from '@/features/admin-users/domain/models/platformQuotaItem'
import type { ApiKey } from '@/features/keys/domain/models/apiKey'

export interface AdminUsersQueryRepository {
  list(
    page?: number,
    pageSize?: number,
    filters?: {
      status?: 'active' | 'disabled'
      role?: 'admin' | 'user'
      search?: string
      group_name?: string
      api_key_group_id?: number
      attributes?: Record<number, string>
      include_subscriptions?: boolean
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    },
    options?: { signal?: AbortSignal }
  ): Promise<PaginatedResponse<AdminUser>>
  getById(id: number, includeDeleted?: boolean): Promise<AdminUser>
  getUserApiKeys(id: number): Promise<PaginatedResponse<ApiKey>>
  getUserUsageStats(id: number, period?: string): Promise<AdminUserUsageStats>
  getUserBalanceHistory(id: number, page?: number, pageSize?: number, type?: string): Promise<BalanceHistoryPage>
  getPlatformQuotas(id: number): Promise<PlatformQuotaItem[]>
  getBatchPlatformQuotas(userIds: number[]): Promise<Record<number, PlatformQuotaItem[]>>
}
