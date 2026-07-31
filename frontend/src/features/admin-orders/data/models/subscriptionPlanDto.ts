import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { SubscriptionPlan } from '@/features/admin-orders/domain/models/subscriptionPlan'

export class SubscriptionPlanDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose({ name: 'group_id' })
  @Transform(({ value }) => value ?? 0)
  groupId!: number

  @Expose({ name: 'group_platform' })
  @Transform(({ value }) => value ?? '')
  groupPlatform!: string

  @Expose({ name: 'group_name' })
  @Transform(({ value }) => value ?? '')
  groupName!: string

  @Expose({ name: 'rate_multiplier' })
  @Transform(({ value }) => value ?? 0)
  rateMultiplier!: number

  @Expose({ name: 'peak_rate_enabled' })
  @Transform(({ value }) => value ?? false)
  peakRateEnabled!: boolean

  @Expose({ name: 'peak_start' })
  @Transform(({ value }) => value ?? '')
  peakStart!: string

  @Expose({ name: 'peak_end' })
  @Transform(({ value }) => value ?? '')
  peakEnd!: string

  @Expose({ name: 'peak_rate_multiplier' })
  @Transform(({ value }) => value ?? 0)
  peakRateMultiplier!: number

  @Expose({ name: 'daily_limit_usd' })
  dailyLimitUsd!: number | null

  @Expose({ name: 'weekly_limit_usd' })
  weeklyLimitUsd!: number | null

  @Expose({ name: 'monthly_limit_usd' })
  monthlyLimitUsd!: number | null

  @Expose({ name: 'supported_model_scopes' })
  @Transform(({ value }) => value ?? [])
  supportedModelScopes!: string[]

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  description!: string

  @Expose()
  @Transform(({ value }) => value ?? 0)
  price!: number

  @Expose({ name: 'original_price' })
  @Transform(({ value }) => value ?? 0)
  originalPrice!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  currency!: string

  @Expose({ name: 'validity_days' })
  @Transform(({ value }) => value ?? 0)
  validityDays!: number

  @Expose({ name: 'validity_unit' })
  @Transform(({ value }) => value ?? 'days')
  validityUnit!: string

  @Expose()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split('\n').map((f: string) => f.trim()).filter(Boolean)
    }
    return value ?? []
  })
  features!: string[]

  @Expose({ name: 'for_sale' })
  @Transform(({ value }) => value ?? false)
  forSale!: boolean

  @Expose({ name: 'sort_order' })
  @Transform(({ value }) => value ?? 0)
  sortOrder!: number

  static fromJson(json: unknown): SubscriptionPlanDto {
    return plainToInstance(SubscriptionPlanDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): SubscriptionPlan {
    const entity = new SubscriptionPlan()
    entity.id = this.id
    entity.groupId = this.groupId
    entity.groupPlatform = this.groupPlatform
    entity.groupName = this.groupName
    entity.rateMultiplier = this.rateMultiplier
    entity.peakRateEnabled = this.peakRateEnabled
    entity.peakStart = this.peakStart
    entity.peakEnd = this.peakEnd
    entity.peakRateMultiplier = this.peakRateMultiplier
    entity.dailyLimitUsd = this.dailyLimitUsd
    entity.weeklyLimitUsd = this.weeklyLimitUsd
    entity.monthlyLimitUsd = this.monthlyLimitUsd
    entity.supportedModelScopes = this.supportedModelScopes
    entity.name = this.name
    entity.description = this.description
    entity.price = this.price
    entity.originalPrice = this.originalPrice
    entity.currency = this.currency
    entity.validityDays = this.validityDays
    entity.validityUnit = this.validityUnit
    entity.features = this.features
    entity.forSale = this.forSale
    entity.sortOrder = this.sortOrder
    return entity
  }
}
