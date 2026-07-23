export class CheckMixedChannelResponse {
  hasRisk!: boolean
  error!: string
  message!: string
  details?: {
    groupId: number
    groupName: string
    currentPlatform: string
    otherPlatform: string
  }
}
