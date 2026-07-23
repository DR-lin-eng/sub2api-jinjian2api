export class SubscriptionPlan {
  id!: number
  groupId!: number
  groupPlatform!: string
  groupName!: string
  rateMultiplier!: number
  peakRateEnabled!: boolean
  peakStart!: string
  peakEnd!: string
  peakRateMultiplier!: number
  dailyLimitUsd!: number | null
  weeklyLimitUsd!: number | null
  monthlyLimitUsd!: number | null
  supportedModelScopes!: string[]
  name!: string
  description!: string
  price!: number
  originalPrice!: number
  currency!: string
  validityDays!: number
  validityUnit!: string
  features!: string[]
  forSale!: boolean
  sortOrder!: number
}
