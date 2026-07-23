import type { UserAvailableGroup } from './userAvailableGroup'
import type { UserSupportedModel } from './userSupportedModel'

export interface UserChannelPlatformSection {
  platform: string
  groups: UserAvailableGroup[]
  supportedModels: UserSupportedModel[]
}
