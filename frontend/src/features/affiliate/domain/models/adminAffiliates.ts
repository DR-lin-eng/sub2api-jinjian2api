/**
 * Admin Affiliates domain entities (camelCase)
 */

export interface AffiliateAdminEntry {
  userId: number
  email: string
  username: string
  affCode: string
  affCodeCustom: boolean
  affRebateRatePercent?: number | null
  affCount: number
}

export interface ListAffiliateUsersParams {
  page?: number
  pageSize?: number
  search?: string
}

export interface ListAffiliateRecordsParams {
  page?: number
  pageSize?: number
  search?: string
  startAt?: string
  endAt?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  timezone?: string
}

export interface AffiliateInviteRecord {
  inviterId: number
  inviterEmail: string
  inviterUsername: string
  inviteeId: number
  inviteeEmail: string
  inviteeUsername: string
  affCode: string
  totalRebate: number
  createdAt: string
}

export interface AffiliateRebateRecord {
  orderId: number
  outTradeNo: string
  inviterId: number
  inviterEmail: string
  inviterUsername: string
  inviteeId: number
  inviteeEmail: string
  inviteeUsername: string
  orderAmount: number
  payAmount: number
  rebateAmount: number
  paymentType: string
  orderStatus: string
  createdAt: string
}

export interface AffiliateTransferRecord {
  ledgerId: number
  userId: number
  userEmail: string
  username: string
  amount: number
  balanceAfter?: number | null
  availableQuotaAfter?: number | null
  frozenQuotaAfter?: number | null
  historyQuotaAfter?: number | null
  snapshotAvailable: boolean
  createdAt: string
}

export interface AffiliateUserOverview {
  userId: number
  email: string
  username: string
  affCode: string
  rebateRatePercent: number
  invitedCount: number
  rebatedInviteeCount: number
  availableQuota: number
  historyQuota: number
}

export interface UpdateAffiliateUserRequest {
  affCode?: string
  affRebateRatePercent?: number | null
  clearRebateRate?: boolean
}

export interface BatchSetRateRequest {
  userIds: number[]
  affRebateRatePercent?: number | null
  clear?: boolean
}

export interface SimpleUser {
  id: number
  email: string
  username: string
}
