import type { AccountPlatform } from '@/types'

export interface CheckMixedChannelRequest {
  platform: AccountPlatform
  groupIds: number[]
  accountId?: number
}

export interface CheckMixedChannelResponse {
  hasRisk: boolean
  error?: string
  message?: string
  details?: {
    groupId: number
    groupName: string
    currentPlatform: string
    otherPlatform: string
  }
}
