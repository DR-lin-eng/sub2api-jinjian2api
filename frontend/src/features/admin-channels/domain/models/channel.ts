import type { ChannelStatus, BillingModelSource } from '@/core/constants/channel'
import type { ChannelModelPricing } from '@/features/admin-channels/domain/models/channelModelPricing'
import type { AccountStatsPricingRule } from '@/features/admin-channels/domain/models/accountStatsPricingRule'

export class Channel {
  id!: number
  name!: string
  description!: string
  status!: ChannelStatus
  billingModelSource!: BillingModelSource
  restrictModels!: boolean
  featuresConfig?: Record<string, unknown>
  groupIds!: number[]
  modelPricing!: ChannelModelPricing[]
  modelMapping!: Record<string, Record<string, string>>
  applyPricingToAccountStats!: boolean
  accountStatsPricingRules!: AccountStatsPricingRule[]
  createdAt!: string
  updatedAt!: string
}
