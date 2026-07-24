import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import type { AffiliateAdminEntry } from '@/features/affiliate/domain/models/affiliateAdminEntry'
import type { AffiliateInviteRecord } from '@/features/affiliate/domain/models/affiliateInviteRecord'
import type { AffiliateRebateRecord } from '@/features/affiliate/domain/models/affiliateRebateRecord'
import type { AffiliateTransferRecord } from '@/features/affiliate/domain/models/affiliateTransferRecord'
import type { AffiliateUserOverview } from '@/features/affiliate/domain/models/affiliateUserOverview'
import type { ListAffiliateUsersParams } from '@/features/affiliate/data/requests_models/listAffiliateUsersParams'
import type { ListAffiliateRecordsParams } from '@/features/affiliate/data/requests_models/listAffiliateRecordsParams'

export interface AffiliateQueryRepository {
  listUsers(params?: ListAffiliateUsersParams): Promise<PaginatedResponse<AffiliateAdminEntry>>
  listInviteRecords(params?: ListAffiliateRecordsParams): Promise<PaginatedResponse<AffiliateInviteRecord>>
  listRebateRecords(params?: ListAffiliateRecordsParams): Promise<PaginatedResponse<AffiliateRebateRecord>>
  listTransferRecords(params?: ListAffiliateRecordsParams): Promise<PaginatedResponse<AffiliateTransferRecord>>
  getUserOverview(userId: number): Promise<AffiliateUserOverview>
}
