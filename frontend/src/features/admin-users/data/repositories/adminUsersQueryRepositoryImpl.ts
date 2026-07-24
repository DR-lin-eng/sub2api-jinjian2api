import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import type { AdminUser } from '@/features/admin-users/domain/models/adminUser'
import type { AdminUserUsageStats } from '@/features/admin-users/domain/models/adminUserUsageStats'
import type { BalanceHistoryPage } from '@/features/admin-users/domain/models/balanceHistoryPage'
import type { PlatformQuotaItem } from '@/features/admin-users/domain/models/platformQuotaItem'
import type { ApiKey } from '@/features/keys/domain/models/apiKey'
import type { AdminUsersQueryRepository } from '@/features/admin-users/domain/repositories/adminUsersQueryRepository'
import { adminUsersQueryDatasource } from '@/features/admin-users/data/datasources/adminUsersQueryDatasource'

export class AdminUsersQueryRepositoryImpl implements AdminUsersQueryRepository {
  private readonly ds = adminUsersQueryDatasource

  async list(
    page?: number,
    pageSize?: number,
    filters?: Parameters<AdminUsersQueryRepository['list']>[2],
    options?: { signal?: AbortSignal }
  ): Promise<PaginatedResponse<AdminUser>> {
    const result = await this.ds.list(page, pageSize, filters, options)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  async getById(id: number, includeDeleted = false): Promise<AdminUser> {
    return (await this.ds.getById(id, includeDeleted)).toEntity()
  }

  async getUserApiKeys(id: number): Promise<PaginatedResponse<ApiKey>> {
    const result = await this.ds.getUserApiKeys(id)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  async getUserUsageStats(id: number, period?: string): Promise<AdminUserUsageStats> {
    return (await this.ds.getUserUsageStats(id, period)).toEntity()
  }

  async getUserBalanceHistory(
    id: number,
    page?: number,
    pageSize?: number,
    type?: string
  ): Promise<BalanceHistoryPage> {
    const result = await this.ds.getUserBalanceHistory(id, page, pageSize, type)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  async getPlatformQuotas(id: number): Promise<PlatformQuotaItem[]> {
    return (await this.ds.getPlatformQuotas(id)).map(dto => dto.toEntity())
  }

  async getBatchPlatformQuotas(userIds: number[]): Promise<Record<number, PlatformQuotaItem[]>> {
    const raw = await this.ds.getBatchPlatformQuotas(userIds)
    const result: Record<number, PlatformQuotaItem[]> = {}
    for (const [userId, dtos] of Object.entries(raw)) {
      result[Number(userId)] = dtos.map(dto => dto.toEntity())
    }
    return result
  }
}

export const adminUsersQueryRepository: AdminUsersQueryRepository = new AdminUsersQueryRepositoryImpl()
