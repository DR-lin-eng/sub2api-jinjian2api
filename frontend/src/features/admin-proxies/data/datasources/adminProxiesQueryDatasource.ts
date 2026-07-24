import { apiClient } from '@/core/networks/client'
import type { PaginatedResponse } from '@/types'
import { ProxyDto } from '@/features/admin-proxies/data/models/proxyDto'
import { ProxyAccountSummaryDto } from '@/features/admin-proxies/data/models/proxyAccountSummaryDto'
import { ProxyQualityCheckResultDto } from '@/features/admin-proxies/data/models/proxyQualityCheckResultDto'
import type { AdminDataPayload } from '@/features/admin-accounts/domain/models/adminDataPayload'

export class AdminProxiesQueryDatasource {
  async list(
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
  ): Promise<PaginatedResponse<ProxyDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/proxies', {
      params: { page, page_size: pageSize, ...filters },
      signal: options?.signal,
    })
    return { ...data, items: (data.items ?? []).map(item => ProxyDto.fromJson(item)) }
  }

  async getAll(): Promise<ProxyDto[]> {
    const { data } = await apiClient.get<unknown[]>('/admin/proxies/all')
    return (data ?? []).map(item => ProxyDto.fromJson(item))
  }

  async getAllWithCount(): Promise<ProxyDto[]> {
    const { data } = await apiClient.get<unknown[]>('/admin/proxies/all', {
      params: { with_count: 'true' },
    })
    return (data ?? []).map(item => ProxyDto.fromJson(item))
  }

  async getById(id: number): Promise<ProxyDto> {
    const { data } = await apiClient.get<unknown>(`/admin/proxies/${id}`)
    return ProxyDto.fromJson(data)
  }

  async checkProxyQuality(id: number): Promise<ProxyQualityCheckResultDto> {
    const { data } = await apiClient.post<unknown>(`/admin/proxies/${id}/quality-check`)
    return ProxyQualityCheckResultDto.fromJson(data)
  }

  async getStats(id: number): Promise<{
    total_accounts: number
    active_accounts: number
    total_requests: number
    success_rate: number
    average_latency: number
  }> {
    const { data } = await apiClient.get<{
      total_accounts: number
      active_accounts: number
      total_requests: number
      success_rate: number
      average_latency: number
    }>(`/admin/proxies/${id}/stats`)
    return data
  }

  async getProxyAccounts(id: number): Promise<ProxyAccountSummaryDto[]> {
    const { data } = await apiClient.get<unknown[]>(`/admin/proxies/${id}/accounts`)
    return (data ?? []).map(item => ProxyAccountSummaryDto.fromJson(item))
  }

  async exportData(options?: {
    ids?: number[]
    filters?: {
      protocol?: string
      status?: 'active' | 'inactive' | 'expired'
      search?: string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    }
  }): Promise<AdminDataPayload> {
    const params: Record<string, string> = {}
    if (options?.ids && options.ids.length > 0) {
      params.ids = options.ids.join(',')
    } else if (options?.filters) {
      const { protocol, status, search, sort_by, sort_order } = options.filters
      if (protocol) params.protocol = protocol
      if (status) params.status = status
      if (search) params.search = search
      if (sort_by) params.sort_by = sort_by
      if (sort_order) params.sort_order = sort_order
    }
    const { data } = await apiClient.get<AdminDataPayload>('/admin/proxies/data', { params })
    return data
  }
}

export const adminProxiesQueryDatasource = new AdminProxiesQueryDatasource()
