import type { PaymentType } from '@/features/admin-orders/domain/models/orderTypes'

export class PaymentConfig {
  paymentEnabled!: boolean
  minAmount!: number
  maxAmount!: number
  dailyLimit!: number
  maxPendingOrders!: number
  orderTimeoutMinutes!: number
  balanceDisabled!: boolean
  balanceRechargeMultiplier!: number
  subscriptionUsdToCnyRate!: number
  enabledPaymentTypes!: PaymentType[]
  helpImageUrl!: string
  helpText!: string
  stripePublishableKey!: string
}
