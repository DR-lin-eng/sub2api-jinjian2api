import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { adminUsageQueryDatasource } from '@/features/admin-usage/data/datasources/adminUsageQueryDatasource'
import type { AdminUsageQueryRepository } from '@/features/admin-usage/domain/repositories/adminUsageQueryRepository'
import type { AdminUsageLog } from '@/features/admin-usage/domain/models/adminUsageLog'
import type { AdminUsageStatsResponse } from '@/features/admin-usage/domain/models/adminUsageStatsResponse'
import type { SimpleUser } from '@/features/admin-usage/domain/models/simpleUser'
import type { SimpleApiKey } from '@/features/admin-usage/domain/models/simpleApiKey'
import type { UsageCleanupTask } from '@/features/admin-usage/domain/models/usageCleanupTask'
import type { AdminUsageQueryParams } from '@/features/admin-usage/domain/models/adminUsageQueryParams'
import type { AdminUsageStatsRequest } from '@/features/admin-usage/data/requests_models/adminUsageStatsRequest'
import type { ListCleanupTasksRequest } from '@/features/admin-usage/data/requests_models/listCleanupTasksRequest'

function toListRequest(p: Partial<AdminUsageQueryParams>) {
  return {
    page: p.page,
    page_size: p.pageSize,
    api_key_id: p.apiKeyId,
    user_id: p.userId,
    account_id: p.accountId,
    group_id: p.groupId,
    model: p.model,
    request_type: p.requestType || undefined,
    stream: p.stream,
    billing_type: p.billingType,
    billing_mode: p.billingMode,
    start_date: p.startDate,
    end_date: p.endDate,
    timezone: p.timezone,
    sort_by: p.sortBy,
    sort_order: p.sortOrder,
    error_phase: p.errorPhase,
    error_category: p.errorCategory,
    status_code: p.statusCode,
    exact_total: p.exactTotal,
  }
}

class AdminUsageQueryRepositoryImpl implements AdminUsageQueryRepository {
  private readonly ds = adminUsageQueryDatasource

  list = async (params: Partial<AdminUsageQueryParams>, options?: { signal?: AbortSignal }) : Promise<PaginatedResponse<AdminUsageLog>>  => {
    const result = await this.ds.list(toListRequest(params), options)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  getStats = async (params: Partial<AdminUsageQueryParams> & { nocache?: number }) : Promise<AdminUsageStatsResponse>  => {
    const req: AdminUsageStatsRequest = {
      user_id: params.userId,
      api_key_id: params.apiKeyId,
      account_id: params.accountId,
      group_id: params.groupId,
      model: params.model,
      request_type: params.requestType || undefined,
      stream: params.stream,
      start_date: params.startDate,
      end_date: params.endDate,
      timezone: params.timezone,
      nocache: params.nocache,
    }
    return (await this.ds.getStats(req)).toEntity()
  }

  searchUsers = async (keyword: string) : Promise<SimpleUser[]>  => {
    return (await this.ds.searchUsers(keyword)).map(dto => dto.toEntity())
  }

  searchApiKeys = async (userId?: number, keyword?: string) : Promise<SimpleApiKey[]>  => {
    return (await this.ds.searchApiKeys(userId, keyword)).map(dto => dto.toEntity())
  }

  listCleanupTasks = async (params: ListCleanupTasksRequest, options?: { signal?: AbortSignal }) : Promise<PaginatedResponse<UsageCleanupTask>>  => {
    const result = await this.ds.listCleanupTasks(params, options)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }
}

export const adminUsageQueryRepository: AdminUsageQueryRepository = new AdminUsageQueryRepositoryImpl()
