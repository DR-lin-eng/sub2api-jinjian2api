import { adminPromoQueryDatasource } from '@/features/admin-promo/data/datasources/adminPromoQueryDatasource'
import type { AdminPromoQueryRepository } from '@/features/admin-promo/domain/repositories/adminPromoQueryRepository'
import type { PromoCode } from '@/features/admin-promo/domain/models/promoCode'
import type { PromoCodeUsage } from '@/features/admin-promo/domain/models/promoCodeUsage'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'

class AdminPromoQueryRepositoryImpl implements AdminPromoQueryRepository {
  private readonly ds = adminPromoQueryDatasource

  list = async (
    page: number,
    pageSize: number,
    filters?: { status?: string; search?: string; sort_by?: string; sort_order?: 'asc' | 'desc' },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<PromoCode>> => {
    const result = await this.ds.list(page, pageSize, filters, options)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  getById = async (id: number) : Promise<PromoCode>  => {
    return (await this.ds.getById(id)).toEntity()
  }

  getUsages = async (id: number, page: number, pageSize: number) : Promise<PaginatedResponse<PromoCodeUsage>>  => {
    const result = await this.ds.getUsages(id, page, pageSize)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }
}

export const adminPromoQueryRepository: AdminPromoQueryRepository = new AdminPromoQueryRepositoryImpl()
