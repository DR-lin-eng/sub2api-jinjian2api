import { apiClient } from '@/core/networks/client'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { AffiliateAdminEntryDto } from '@/features/affiliate/data/models/affiliateAdminEntryDto'
import { AffiliateInviteRecordDto } from '@/features/affiliate/data/models/affiliateInviteRecordDto'
import { AffiliateRebateRecordDto } from '@/features/affiliate/data/models/affiliateRebateRecordDto'
import { AffiliateTransferRecordDto } from '@/features/affiliate/data/models/affiliateTransferRecordDto'
import { AffiliateUserOverviewDto } from '@/features/affiliate/data/models/affiliateUserOverviewDto'
import type { ListAffiliateUsersParams } from '@/features/affiliate/data/requests_models/listAffiliateUsersParams'
import type { ListAffiliateRecordsParams } from '@/features/affiliate/data/requests_models/listAffiliateRecordsParams'

export class AffiliateQueryDatasource {
  async listUsers(params: ListAffiliateUsersParams = {}): Promise<PaginatedResponse<AffiliateAdminEntryDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/affiliates/users', {
      params: {
        page: params.page ?? 1,
        page_size: params.page_size ?? 20,
        search: params.search ?? '',
      },
    })
    return { ...data, items: (data.items ?? []).map(item => AffiliateAdminEntryDto.fromJson(item)) }
  }

  async listInviteRecords(params: ListAffiliateRecordsParams = {}): Promise<PaginatedResponse<AffiliateInviteRecordDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/affiliates/invites', {
      params: buildRecordParams(params),
    })
    return { ...data, items: (data.items ?? []).map(item => AffiliateInviteRecordDto.fromJson(item)) }
  }

  async listRebateRecords(params: ListAffiliateRecordsParams = {}): Promise<PaginatedResponse<AffiliateRebateRecordDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/affiliates/rebates', {
      params: buildRecordParams(params),
    })
    return { ...data, items: (data.items ?? []).map(item => AffiliateRebateRecordDto.fromJson(item)) }
  }

  async listTransferRecords(params: ListAffiliateRecordsParams = {}): Promise<PaginatedResponse<AffiliateTransferRecordDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/affiliates/transfers', {
      params: buildRecordParams(params),
    })
    return { ...data, items: (data.items ?? []).map(item => AffiliateTransferRecordDto.fromJson(item)) }
  }

  async getUserOverview(userId: number): Promise<AffiliateUserOverviewDto> {
    const { data } = await apiClient.get<unknown>(`/admin/affiliates/users/${userId}/overview`)
    return AffiliateUserOverviewDto.fromJson(data)
  }
}

function buildRecordParams(params: ListAffiliateRecordsParams) {
  return {
    page: params.page ?? 1,
    page_size: params.page_size ?? 20,
    search: params.search ?? '',
    start_at: params.start_at || undefined,
    end_at: params.end_at || undefined,
    sort_by: params.sort_by || undefined,
    sort_order: params.sort_order || undefined,
    timezone: params.timezone || undefined,
  }
}

export const affiliateQueryDatasource = new AffiliateQueryDatasource()
