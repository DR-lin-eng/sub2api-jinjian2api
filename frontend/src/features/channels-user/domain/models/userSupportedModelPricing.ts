import type { UserPricingInterval } from './userPricingInterval'

export class UserSupportedModelPricing {
  billingMode!: string
  inputPrice!: number | null
  outputPrice!: number | null
  cacheWritePrice!: number | null
  cacheReadPrice!: number | null
  imageInputPrice!: number | null
  imageOutputPrice!: number | null
  perRequestPrice!: number | null
  intervals!: UserPricingInterval[]
}
