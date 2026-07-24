import { apiClient } from '@/core/networks/client'
import type { PaginatedResponse } from '@/types'
import { RedeemCodeDto } from '@/features/admin-redeem/data/models/redeemCodeDto'
import type { RedeemCodeType } from '@/features/admin-redeem/domain/models/redeemCode'

export class AdminRedeemQueryDatasource {
  async list(
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      type?: RedeemCodeType
      status?: 'active' | 'used' | 'expired' | 'unused' | 'disabled'
      search?: string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<RedeemCodeDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/redeem-codes', {
      params: { page, page_size: pageSize, ...filters },
      signal: options?.signal,
    })
    return { ...data, items: (data.items ?? []).map(item => RedeemCodeDto.fromJson(item)) }
  }

  async getById(id: number): Promise<RedeemCodeDto> {
    const { data } = await apiClient.get<unknown>(`/admin/redeem-codes/${id}`)
    return RedeemCodeDto.fromJson(data)
  }

  async getStats(): Promise<{
    total_codes: number
    active_codes: number
    used_codes: number
    expired_codes: number
    total_value_distributed: number
    by_type: Record<RedeemCodeType, number>
  }> {
    const { data } = await apiClient.get<{
      total_codes: number
      active_codes: number
      used_codes: number
      expired_codes: number
      total_value_distributed: number
      by_type: Record<RedeemCodeType, number>
    }>('/admin/redeem-codes/stats')
    return data
  }

  async exportCodes(filters?: {
    type?: RedeemCodeType
    status?: 'used' | 'expired' | 'unused' | 'disabled'
    search?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  }): Promise<Blob> {
    const response = await apiClient.get('/admin/redeem-codes/export', {
      params: filters,
      responseType: 'blob',
    })
    return response.data
  }
}

export const adminRedeemQueryDatasource = new AdminRedeemQueryDatasource()
