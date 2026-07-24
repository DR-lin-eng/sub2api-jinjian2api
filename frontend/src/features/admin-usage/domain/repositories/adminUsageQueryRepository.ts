import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import type { AdminUsageLog } from '@/features/admin-usage/domain/models/adminUsageLog'
import type { AdminUsageStatsResponse } from '@/features/admin-usage/domain/models/adminUsageStatsResponse'
import type { SimpleUser } from '@/features/admin-usage/domain/models/simpleUser'
import type { SimpleApiKey } from '@/features/admin-usage/domain/models/simpleApiKey'
import type { UsageCleanupTask } from '@/features/admin-usage/domain/models/usageCleanupTask'
import type { AdminUsageQueryParams } from '@/features/admin-usage/domain/models/adminUsageQueryParams'
import type { ListCleanupTasksRequest } from '@/features/admin-usage/data/requests_models/listCleanupTasksRequest'

export interface AdminUsageQueryRepository {
  list(params: Partial<AdminUsageQueryParams>, options?: { signal?: AbortSignal }): Promise<PaginatedResponse<AdminUsageLog>>
  getStats(params: Partial<AdminUsageQueryParams> & { nocache?: number }): Promise<AdminUsageStatsResponse>
  searchUsers(keyword: string): Promise<SimpleUser[]>
  searchApiKeys(userId?: number, keyword?: string): Promise<SimpleApiKey[]>
  listCleanupTasks(params: ListCleanupTasksRequest, options?: { signal?: AbortSignal }): Promise<PaginatedResponse<UsageCleanupTask>>
}
