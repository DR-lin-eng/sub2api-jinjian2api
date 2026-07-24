import type { UserChannelPlatformSection } from './userChannelPlatformSection'

export class UserAvailableChannel {
  name!: string
  description!: string
  platforms!: UserChannelPlatformSection[]
}
