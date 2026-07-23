/**
 * Admin Affiliates DTOs (snake_case) with toEntity() converters
 */

import type {
  AffiliateAdminEntry,
  AffiliateInviteRecord,
  AffiliateRebateRecord,
  AffiliateTransferRecord,
  AffiliateUserOverview,
  UpdateAffiliateUserRequest,
  BatchSetRateRequest,
  SimpleUser,
} from '@/features/affiliate/domain/models/adminAffiliates'

export interface AffiliateAdminEntryDto {
  user_id: number
  email: string
  username: string
  aff_code: string
  aff_code_custom: boolean
  aff_rebate_rate_percent?: number | null
  aff_count: number
}

export interface AffiliateInviteRecordDto {
  inviter_id: number
  inviter_email: string
  inviter_username: string
  invitee_id: number
  invitee_email: string
  invitee_username: string
  aff_code: string
  total_rebate: number
  created_at: string
}

export interface AffiliateRebateRecordDto {
  order_id: number
  out_trade_no: string
  inviter_id: number
  inviter_email: string
  inviter_username: string
  invitee_id: number
  invitee_email: string
  invitee_username: string
  order_amount: number
  pay_amount: number
  rebate_amount: number
  payment_type: string
  order_status: string
  created_at: string
}

export interface AffiliateTransferRecordDto {
  ledger_id: number
  user_id: number
  user_email: string
  username: string
  amount: number
  balance_after?: number | null
  available_quota_after?: number | null
  frozen_quota_after?: number | null
  history_quota_after?: number | null
  snapshot_available: boolean
  created_at: string
}

export interface AffiliateUserOverviewDto {
  user_id: number
  email: string
  username: string
  aff_code: string
  rebate_rate_percent: number
  invited_count: number
  rebated_invitee_count: number
  available_quota: number
  history_quota: number
}

export interface UpdateAffiliateUserRequestDto {
  aff_code?: string
  aff_rebate_rate_percent?: number | null
  clear_rebate_rate?: boolean
}

export interface BatchSetRateRequestDto {
  user_ids: number[]
  aff_rebate_rate_percent?: number | null
  clear?: boolean
}

export interface SimpleUserDto {
  id: number
  email: string
  username: string
}

// ---- converters ----

export function affiliateAdminEntryDtoToEntity(dto: AffiliateAdminEntryDto): AffiliateAdminEntry {
  return {
    userId: dto.user_id ?? 0,
    email: dto.email ?? '',
    username: dto.username ?? '',
    affCode: dto.aff_code ?? '',
    affCodeCustom: dto.aff_code_custom ?? false,
    affRebateRatePercent: dto.aff_rebate_rate_percent ?? null,
    affCount: dto.aff_count ?? 0,
  }
}

export function affiliateInviteRecordDtoToEntity(dto: AffiliateInviteRecordDto): AffiliateInviteRecord {
  return {
    inviterId: dto.inviter_id ?? 0,
    inviterEmail: dto.inviter_email ?? '',
    inviterUsername: dto.inviter_username ?? '',
    inviteeId: dto.invitee_id ?? 0,
    inviteeEmail: dto.invitee_email ?? '',
    inviteeUsername: dto.invitee_username ?? '',
    affCode: dto.aff_code ?? '',
    totalRebate: dto.total_rebate ?? 0,
    createdAt: dto.created_at ?? '',
  }
}

export function affiliateRebateRecordDtoToEntity(dto: AffiliateRebateRecordDto): AffiliateRebateRecord {
  return {
    orderId: dto.order_id ?? 0,
    outTradeNo: dto.out_trade_no ?? '',
    inviterId: dto.inviter_id ?? 0,
    inviterEmail: dto.inviter_email ?? '',
    inviterUsername: dto.inviter_username ?? '',
    inviteeId: dto.invitee_id ?? 0,
    inviteeEmail: dto.invitee_email ?? '',
    inviteeUsername: dto.invitee_username ?? '',
    orderAmount: dto.order_amount ?? 0,
    payAmount: dto.pay_amount ?? 0,
    rebateAmount: dto.rebate_amount ?? 0,
    paymentType: dto.payment_type ?? '',
    orderStatus: dto.order_status ?? '',
    createdAt: dto.created_at ?? '',
  }
}

export function affiliateTransferRecordDtoToEntity(dto: AffiliateTransferRecordDto): AffiliateTransferRecord {
  return {
    ledgerId: dto.ledger_id ?? 0,
    userId: dto.user_id ?? 0,
    userEmail: dto.user_email ?? '',
    username: dto.username ?? '',
    amount: dto.amount ?? 0,
    balanceAfter: dto.balance_after ?? null,
    availableQuotaAfter: dto.available_quota_after ?? null,
    frozenQuotaAfter: dto.frozen_quota_after ?? null,
    historyQuotaAfter: dto.history_quota_after ?? null,
    snapshotAvailable: dto.snapshot_available ?? false,
    createdAt: dto.created_at ?? '',
  }
}

export function affiliateUserOverviewDtoToEntity(dto: AffiliateUserOverviewDto): AffiliateUserOverview {
  return {
    userId: dto.user_id ?? 0,
    email: dto.email ?? '',
    username: dto.username ?? '',
    affCode: dto.aff_code ?? '',
    rebateRatePercent: dto.rebate_rate_percent ?? 0,
    invitedCount: dto.invited_count ?? 0,
    rebatedInviteeCount: dto.rebated_invitee_count ?? 0,
    availableQuota: dto.available_quota ?? 0,
    historyQuota: dto.history_quota ?? 0,
  }
}

export function updateAffiliateUserRequestToDto(entity: UpdateAffiliateUserRequest): UpdateAffiliateUserRequestDto {
  return {
    aff_code: entity.affCode,
    aff_rebate_rate_percent: entity.affRebateRatePercent,
    clear_rebate_rate: entity.clearRebateRate,
  }
}

export function batchSetRateRequestToDto(entity: BatchSetRateRequest): BatchSetRateRequestDto {
  return {
    user_ids: entity.userIds ?? [],
    aff_rebate_rate_percent: entity.affRebateRatePercent,
    clear: entity.clear,
  }
}

export function simpleUserDtoToEntity(dto: SimpleUserDto): SimpleUser {
  return {
    id: dto.id ?? 0,
    email: dto.email ?? '',
    username: dto.username ?? '',
  }
}
