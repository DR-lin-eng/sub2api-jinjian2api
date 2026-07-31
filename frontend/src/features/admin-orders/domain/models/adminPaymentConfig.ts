export class AdminPaymentConfig {
  enabled!: boolean
  minAmount!: number
  maxAmount!: number
  dailyLimit!: number
  orderTimeoutMinutes!: number
  maxPendingOrders!: number
  enabledPaymentTypes!: string[]
  balanceDisabled!: boolean
  balanceRechargeMultiplier!: number
  subscriptionUsdToCnyRate!: number
  rechargeFeeRate!: number
  loadBalanceStrategy!: string
  productNamePrefix!: string
  productNameSuffix!: string
  helpImageUrl!: string
  helpText!: string
}
