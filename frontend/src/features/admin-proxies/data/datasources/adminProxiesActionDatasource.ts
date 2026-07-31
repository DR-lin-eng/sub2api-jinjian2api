import { apiClient } from '@/core/networks/client'
import { ProxyDto } from '@/features/admin-proxies/data/models/proxyDto'
import type { CreateProxyRequest } from '@/features/admin-proxies/data/requests_models/createProxyRequest'
import type { UpdateProxyRequest } from '@/features/admin-proxies/data/requests_models/updateProxyRequest'
import type { BatchCreateProxyRequest } from '@/features/admin-proxies/data/requests_models/batchCreateProxyRequest'
import type { BatchDeleteProxyRequest } from '@/features/admin-proxies/data/requests_models/batchDeleteProxyRequest'
import type { AdminDataPayload } from '@/features/admin-accounts/domain/models/adminDataPayload'
import type { AdminDataImportResult } from '@/features/admin-accounts/domain/models/adminDataImportResult'

export class AdminProxiesActionDatasource {
  async create(req: CreateProxyRequest): Promise<ProxyDto> {
    const { data } = await apiClient.post<unknown>('/admin/proxies', req)
    return ProxyDto.fromJson(data)
  }

  async update(id: number, req: UpdateProxyRequest): Promise<ProxyDto> {
    const { data } = await apiClient.put<unknown>(`/admin/proxies/${id}`, req)
    return ProxyDto.fromJson(data)
  }

  async deleteProxy(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/proxies/${id}`)
    return data
  }

  async toggleStatus(id: number, status: 'active' | 'inactive'): Promise<ProxyDto> {
    return this.update(id, { status })
  }

  async testProxy(id: number): Promise<{
    success: boolean
    message: string
    latency_ms?: number
    ip_address?: string
    city?: string
    region?: string
    country?: string
    country_code?: string
  }> {
    const { data } = await apiClient.post<{
      success: boolean
      message: string
      latency_ms?: number
      ip_address?: string
      city?: string
      region?: string
      country?: string
      country_code?: string
    }>(`/admin/proxies/${id}/test`)
    return data
  }

  async batchCreate(req: BatchCreateProxyRequest): Promise<{ created: number; skipped: number }> {
    const { data } = await apiClient.post<{ created: number; skipped: number }>('/admin/proxies/batch', req)
    return data
  }

  async batchDelete(req: BatchDeleteProxyRequest): Promise<{
    deleted_ids: number[]
    skipped: Array<{ id: number; reason: string }>
  }> {
    const { data } = await apiClient.post<{
      deleted_ids: number[]
      skipped: Array<{ id: number; reason: string }>
    }>('/admin/proxies/batch-delete', req)
    return data
  }

  async importData(payload: { data: AdminDataPayload }): Promise<AdminDataImportResult> {
    const { data } = await apiClient.post<AdminDataImportResult>('/admin/proxies/data', payload)
    return data
  }
}

export const adminProxiesActionDatasource = new AdminProxiesActionDatasource()
