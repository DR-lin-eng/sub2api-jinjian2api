import type { AffiliateInvitee } from './affiliateInvitee'

export class UserAffiliateDetail {
  userId!: number
  affCode!: string
  affCount!: number
  affQuota!: number
  affFrozenQuota!: number
  affHistoryQuota!: number
  effectiveRebateRatePercent!: number
  invitees!: AffiliateInvitee[]
  inviterId?: number | null
}
