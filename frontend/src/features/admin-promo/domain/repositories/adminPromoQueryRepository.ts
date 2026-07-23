import type { PromoCode } from '@/features/admin-promo/domain/models/promoCode'
import type { PromoCodeUsage } from '@/features/admin-promo/domain/models/promoCodeUsage'
import type { PaginatedResponse } from '@/types'

export interface AdminPromoQueryRepository {
  list(
    page: number,
    pageSize: number,
    filters?: { status?: string; search?: string; sort_by?: string; sort_order?: 'asc' | 'desc' },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<PromoCode>>
  getById(id: number): Promise<PromoCode>
  getUsages(id: number, page: number, pageSize: number): Promise<PaginatedResponse<PromoCodeUsage>>
}
