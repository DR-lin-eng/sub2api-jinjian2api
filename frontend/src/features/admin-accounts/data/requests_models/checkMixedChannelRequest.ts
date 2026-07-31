export interface CheckMixedChannelRequest {
  platform: string
  group_ids: number[]
  account_id?: number
}

export interface CheckMixedChannelResponse {
  has_risk: boolean
  error?: string
  message?: string
  details?: {
    group_id: number
    group_name: string
    current_platform: string
    other_platform: string
  }
}
