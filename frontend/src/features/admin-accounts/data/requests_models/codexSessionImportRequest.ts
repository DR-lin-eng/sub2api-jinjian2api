export interface CodexSessionImportRequest {
  content?: string
  contents?: string[]
  name?: string
  notes?: string | null
  groupIds?: number[]
  proxyId?: number | null
  concurrency?: number
  priority?: number
  rateMultiplier?: number
  loadFactor?: number | null
  expiresAt?: number | null
  autoPauseOnExpired?: boolean
  credentialExtras?: Record<string, unknown>
  extra?: Record<string, unknown>
  updateExisting?: boolean
  skipDefaultGroupBind?: boolean
  confirmMixedChannelRisk?: boolean
}
