import type { RedeemCode } from '@/features/admin-redeem/domain/models/redeemCode'
import type { RedeemCodeType } from '@/features/admin-redeem/enums/redeemCodeType'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'

export interface AdminRedeemQueryRepository {
  list(
    page: number,
    pageSize: number,
    filters?: {
      type?: RedeemCodeType
      status?: 'active' | 'used' | 'expired' | 'unused' | 'disabled'
      search?: string
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<RedeemCode>>
  getById(id: number): Promise<RedeemCode>
  getStats(): Promise<{
    total_codes: number
    active_codes: number
    used_codes: number
    expired_codes: number
    total_value_distributed: number
    by_type: Record<RedeemCodeType, number>
  }>
  exportCodes(filters?: {
    type?: RedeemCodeType
    status?: 'used' | 'expired' | 'unused' | 'disabled'
    search?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  }): Promise<Blob>
}
