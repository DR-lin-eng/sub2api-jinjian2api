import type { Proxy } from '@/features/admin-proxies/domain/models/proxy'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import type { AdminDataPayload } from '@/features/admin-accounts/domain/models/adminDataPayload'
import type { ProxyQualityCheckResult } from '@/features/admin-proxies/domain/models/proxyQualityCheckResult'
import type { ProxyAccountSummary } from '@/features/admin-proxies/domain/models/proxyAccountSummary'

export interface AdminProxiesQueryRepository {
  list(
    page?: number,
    pageSize?: number,
    filters?: {
      protocol?: string
      status?: 'active' | 'inactive' | 'expired'
      search?: string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<Proxy>>
  getAll(): Promise<Proxy[]>
  getAllWithCount(): Promise<Proxy[]>
  getById(id: number): Promise<Proxy>
  checkProxyQuality(id: number): Promise<ProxyQualityCheckResult>
  getStats(id: number): Promise<{
    total_accounts: number
    active_accounts: number
    total_requests: number
    success_rate: number
    average_latency: number
  }>
  getProxyAccounts(id: number): Promise<ProxyAccountSummary[]>
  exportData(options?: {
    ids?: number[]
    filters?: {
      protocol?: string
      status?: 'active' | 'inactive' | 'expired'
      search?: string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    }
  }): Promise<AdminDataPayload>
}
