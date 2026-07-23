export interface GrokSSOToOAuthRequest {
  ssoTokens: string[]
  name?: string
  notes?: string | null
  proxyId?: number | null
  groupIds?: number[]
  credentials?: Record<string, unknown>
  extra?: Record<string, unknown>
  concurrency?: number
  loadFactor?: number
  priority?: number
  rateMultiplier?: number
  expiresAt?: number | null
  autoPauseOnExpired?: boolean
}
