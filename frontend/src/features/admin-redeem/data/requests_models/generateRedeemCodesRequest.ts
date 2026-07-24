import type { RedeemCodeType } from '@/features/admin-redeem/domain/models/redeemCode'

export interface GenerateRedeemCodesRequest {
  count: number
  type: RedeemCodeType
  value: number
  group_id?: number | null
  validity_days?: number
  expires_in_days?: number | null
  max_uses?: number
  max_uses_per_user?: number
}
