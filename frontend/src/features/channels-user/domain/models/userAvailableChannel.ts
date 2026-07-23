import type { UserChannelPlatformSection } from './userChannelPlatformSection'

export interface UserAvailableChannel {
  name: string
  description: string
  platforms: UserChannelPlatformSection[]
}
