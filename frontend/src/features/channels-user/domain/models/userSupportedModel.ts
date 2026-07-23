import type { UserSupportedModelPricing } from './userSupportedModelPricing'

export interface UserSupportedModel {
  name: string
  platform: string
  pricing: UserSupportedModelPricing | null
}
