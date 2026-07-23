import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AdminPaymentConfig } from '@/features/admin-orders/domain/models/adminPaymentConfig'

export class AdminPaymentConfigDto {
  @Expose()
  @Transform(({ value }) => value ?? false)
  enabled!: boolean

  @Expose({ name: 'min_amount' })
  @Transform(({ value }) => value ?? 0)
  minAmount!: number

  @Expose({ name: 'max_amount' })
  @Transform(({ value }) => value ?? 0)
  maxAmount!: number

  @Expose({ name: 'daily_limit' })
  @Transform(({ value }) => value ?? 0)
  dailyLimit!: number

  @Expose({ name: 'order_timeout_minutes' })
  @Transform(({ value }) => value ?? 30)
  orderTimeoutMinutes!: number

  @Expose({ name: 'max_pending_orders' })
  @Transform(({ value }) => value ?? 5)
  maxPendingOrders!: number

  @Expose({ name: 'enabled_payment_types' })
  @Transform(({ value }) => value ?? [])
  enabledPaymentTypes!: string[]

  @Expose({ name: 'balance_disabled' })
  @Transform(({ value }) => value ?? false)
  balanceDisabled!: boolean

  @Expose({ name: 'balance_recharge_multiplier' })
  @Transform(({ value }) => value ?? 1)
  balanceRechargeMultiplier!: number

  @Expose({ name: 'subscription_usd_to_cny_rate' })
  @Transform(({ value }) => value ?? 0)
  subscriptionUsdToCnyRate!: number

  @Expose({ name: 'recharge_fee_rate' })
  @Transform(({ value }) => value ?? 0)
  rechargeFeeRate!: number

  @Expose({ name: 'load_balance_strategy' })
  @Transform(({ value }) => value ?? '')
  loadBalanceStrategy!: string

  @Expose({ name: 'product_name_prefix' })
  @Transform(({ value }) => value ?? '')
  productNamePrefix!: string

  @Expose({ name: 'product_name_suffix' })
  @Transform(({ value }) => value ?? '')
  productNameSuffix!: string

  @Expose({ name: 'help_image_url' })
  @Transform(({ value }) => value ?? '')
  helpImageUrl!: string

  @Expose({ name: 'help_text' })
  @Transform(({ value }) => value ?? '')
  helpText!: string

  static fromJson(json: unknown): AdminPaymentConfigDto {
    return plainToInstance(AdminPaymentConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminPaymentConfig {
    const entity = new AdminPaymentConfig()
    entity.enabled = this.enabled
    entity.minAmount = this.minAmount
    entity.maxAmount = this.maxAmount
    entity.dailyLimit = this.dailyLimit
    entity.orderTimeoutMinutes = this.orderTimeoutMinutes
    entity.maxPendingOrders = this.maxPendingOrders
    entity.enabledPaymentTypes = this.enabledPaymentTypes
    entity.balanceDisabled = this.balanceDisabled
    entity.balanceRechargeMultiplier = this.balanceRechargeMultiplier
    entity.subscriptionUsdToCnyRate = this.subscriptionUsdToCnyRate
    entity.rechargeFeeRate = this.rechargeFeeRate
    entity.loadBalanceStrategy = this.loadBalanceStrategy
    entity.productNamePrefix = this.productNamePrefix
    entity.productNameSuffix = this.productNameSuffix
    entity.helpImageUrl = this.helpImageUrl
    entity.helpText = this.helpText
    return entity
  }
}
