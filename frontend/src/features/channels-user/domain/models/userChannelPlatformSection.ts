import type { UserAvailableGroup } from './userAvailableGroup'
import type { UserSupportedModel } from './userSupportedModel'

export class UserChannelPlatformSection {
  platform!: string
  groups!: UserAvailableGroup[]
  supportedModels!: UserSupportedModel[]
}
