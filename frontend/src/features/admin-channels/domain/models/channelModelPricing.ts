import type { BillingMode } from '@/core/constants/channel'
import type { PricingInterval } from '@/features/admin-channels/domain/models/pricingInterval'

export class ChannelModelPricing {
  id?: number
  platform!: string
  models!: string[]
  billingMode!: BillingMode
  inputPrice!: number | null
  outputPrice!: number | null
  cacheWritePrice!: number | null
  cacheReadPrice!: number | null
  imageInputPrice!: number | null
  imageOutputPrice!: number | null
  perRequestPrice!: number | null
  intervals!: PricingInterval[]
}
