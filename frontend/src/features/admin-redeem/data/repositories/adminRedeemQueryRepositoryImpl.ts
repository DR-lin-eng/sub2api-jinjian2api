import { adminRedeemQueryDatasource } from '@/features/admin-redeem/data/datasources/adminRedeemQueryDatasource'
import type { AdminRedeemQueryRepository } from '@/features/admin-redeem/domain/repositories/adminRedeemQueryRepository'
import type { RedeemCode } from '@/features/admin-redeem/domain/models/redeemCode'
import type { RedeemCodeType } from '@/features/admin-redeem/enums/redeemCodeType'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'

class AdminRedeemQueryRepositoryImpl implements AdminRedeemQueryRepository {
  private readonly ds = adminRedeemQueryDatasource

  list = async (
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
  ): Promise<PaginatedResponse<RedeemCode>> => {
    const result = await this.ds.list(page, pageSize, filters, options)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  getById = async (id: number) : Promise<RedeemCode>  => {
    return (await this.ds.getById(id)).toEntity()
  }

  getStats = async () => {
    return this.ds.getStats()
  }

  exportCodes = async (filters?: {
    type?: RedeemCodeType
    status?: 'used' | 'expired' | 'unused' | 'disabled'
    search?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  }): Promise<Blob> => {
    return this.ds.exportCodes(filters)
  }
}

export const adminRedeemQueryRepository: AdminRedeemQueryRepository = new AdminRedeemQueryRepositoryImpl()
