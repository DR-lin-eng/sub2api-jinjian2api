import { adminProxiesQueryDatasource } from '@/features/admin-proxies/data/datasources/adminProxiesQueryDatasource'
import type { AdminProxiesQueryRepository } from '@/features/admin-proxies/domain/repositories/adminProxiesQueryRepository'
import type { Proxy } from '@/features/admin-proxies/domain/models/proxy'
import type { ProxyQualityCheckResult } from '@/features/admin-proxies/domain/models/proxyQualityCheckResult'
import type { ProxyAccountSummary } from '@/features/admin-proxies/domain/models/proxyAccountSummary'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import type { AdminDataPayload } from '@/features/admin-accounts/domain/models/adminDataPayload'

class AdminProxiesQueryRepositoryImpl implements AdminProxiesQueryRepository {
  private readonly ds = adminProxiesQueryDatasource

  list = async (
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      protocol?: string
      status?: 'active' | 'inactive' | 'expired'
      search?: string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<Proxy>> => {
    const result = await this.ds.list(page, pageSize, filters, options)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  getAll = async () : Promise<Proxy[]>  => {
    return (await this.ds.getAll()).map(dto => dto.toEntity())
  }

  getAllWithCount = async () : Promise<Proxy[]>  => {
    return (await this.ds.getAllWithCount()).map(dto => dto.toEntity())
  }

  getById = async (id: number) : Promise<Proxy>  => {
    return (await this.ds.getById(id)).toEntity()
  }

  checkProxyQuality = async (id: number) : Promise<ProxyQualityCheckResult>  => {
    return (await this.ds.checkProxyQuality(id)).toEntity()
  }

  getStats = async (id: number) => {
    return this.ds.getStats(id)
  }

  getProxyAccounts = async (id: number) : Promise<ProxyAccountSummary[]>  => {
    return (await this.ds.getProxyAccounts(id)).map(dto => dto.toEntity())
  }

  exportData = async (options?: {
    ids?: number[]
    filters?: {
      protocol?: string
      status?: 'active' | 'inactive' | 'expired'
      search?: string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    }
  }): Promise<AdminDataPayload> => {
    return this.ds.exportData(options)
  }
}

export const adminProxiesQueryRepository: AdminProxiesQueryRepository = new AdminProxiesQueryRepositoryImpl()
