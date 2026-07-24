import type { UserSupportedModelPricing } from './userSupportedModelPricing'

export class UserSupportedModel {
  name!: string
  platform!: string
  pricing!: UserSupportedModelPricing | null
}
