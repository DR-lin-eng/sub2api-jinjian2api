import type { ChannelModelPricing } from '@/features/admin-channels/domain/models/channelModelPricing'

export class AccountStatsPricingRule {
  id?: number
  name!: string
  groupIds!: number[]
  accountIds!: number[]
  pricing!: ChannelModelPricing[]
}
