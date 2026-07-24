import type { MethodLimit } from './methodLimit'
import type { SubscriptionPlan } from '@/features/admin-orders/domain/models/subscriptionPlan'

export class CheckoutInfoResponse {
  methods!: Record<string, MethodLimit>
  globalMin!: number
  globalMax!: number
  plans!: SubscriptionPlan[]
  balanceDisabled!: boolean
  balanceRechargeMultiplier!: number
  subscriptionUsdToCnyRate!: number
  rechargeFeeRate!: number
  helpText!: string
  helpImageUrl!: string
  stripePublishableKey!: string
  alipayForceQrcode?: boolean
}
