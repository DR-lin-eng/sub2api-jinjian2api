import { affiliateQueryDatasource } from '@/features/affiliate/data/datasources/affiliateQueryDatasource'
import type { PaginatedResponse } from '@/types'
import type { AffiliateAdminEntry } from '@/features/affiliate/domain/models/affiliateAdminEntry'
import type { AffiliateInviteRecord } from '@/features/affiliate/domain/models/affiliateInviteRecord'
import type { AffiliateRebateRecord } from '@/features/affiliate/domain/models/affiliateRebateRecord'
import type { AffiliateTransferRecord } from '@/features/affiliate/domain/models/affiliateTransferRecord'
import type { AffiliateUserOverview } from '@/features/affiliate/domain/models/affiliateUserOverview'
import type { ListAffiliateUsersParams } from '@/features/affiliate/data/requests_models/listAffiliateUsersParams'
import type { ListAffiliateRecordsParams } from '@/features/affiliate/data/requests_models/listAffiliateRecordsParams'
import type { AffiliateQueryRepository } from '@/features/affiliate/domain/repositories/affiliateQueryRepository'

class AffiliateQueryRepositoryImpl implements AffiliateQueryRepository {
  private readonly ds = affiliateQueryDatasource

  async listUsers(params?: ListAffiliateUsersParams): Promise<PaginatedResponse<AffiliateAdminEntry>> {
    const result = await this.ds.listUsers(params)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  async listInviteRecords(params?: ListAffiliateRecordsParams): Promise<PaginatedResponse<AffiliateInviteRecord>> {
    const result = await this.ds.listInviteRecords(params)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  async listRebateRecords(params?: ListAffiliateRecordsParams): Promise<PaginatedResponse<AffiliateRebateRecord>> {
    const result = await this.ds.listRebateRecords(params)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  async listTransferRecords(params?: ListAffiliateRecordsParams): Promise<PaginatedResponse<AffiliateTransferRecord>> {
    const result = await this.ds.listTransferRecords(params)
    return { ...result, items: result.items.map(dto => dto.toEntity()) }
  }

  async getUserOverview(userId: number): Promise<AffiliateUserOverview> {
    return (await this.ds.getUserOverview(userId)).toEntity()
  }
}

export const affiliateQueryRepository: AffiliateQueryRepository = new AffiliateQueryRepositoryImpl()
