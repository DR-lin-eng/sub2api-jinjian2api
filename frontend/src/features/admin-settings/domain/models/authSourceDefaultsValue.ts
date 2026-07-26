import type { DefaultSubscriptionSetting } from './defaultSubscriptionSetting'
import type { DefaultPlatformQuotasMap } from './adminSettings'

export class AuthSourceDefaultsValue {
  balance!: number
  concurrency!: number
  subscriptions!: DefaultSubscriptionSetting[]
  grantOnSignup!: boolean
  grantOnFirstBind!: boolean
  platformQuotas!: DefaultPlatformQuotasMap
}
