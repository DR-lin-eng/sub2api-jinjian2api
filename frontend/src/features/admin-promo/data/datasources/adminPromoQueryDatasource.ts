import { apiClient } from '@/core/networks/client'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { PromoCodeDto } from '@/features/admin-promo/data/models/promoCodeDto'
import { PromoCodeUsageDto } from '@/features/admin-promo/data/models/promoCodeUsageDto'

export class AdminPromoQueryDatasource {
  async list(
    page: number = 1,
    pageSize: number = 20,
    filters?: { status?: string; search?: string; sort_by?: string; sort_order?: 'asc' | 'desc' },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<PromoCodeDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/promo-codes', {
      params: { page, page_size: pageSize, ...filters },
      signal: options?.signal,
    })
    return { ...data, items: (data.items ?? []).map(item => PromoCodeDto.fromJson(item)) }
  }

  async getById(id: number): Promise<PromoCodeDto> {
    const { data } = await apiClient.get<unknown>(`/admin/promo-codes/${id}`)
    return PromoCodeDto.fromJson(data)
  }

  async getUsages(
    id: number,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<PaginatedResponse<PromoCodeUsageDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>(
      `/admin/promo-codes/${id}/usages`,
      { params: { page, page_size: pageSize } },
    )
    return { ...data, items: (data.items ?? []).map(item => PromoCodeUsageDto.fromJson(item)) }
  }
}

export const adminPromoQueryDatasource = new AdminPromoQueryDatasource()
