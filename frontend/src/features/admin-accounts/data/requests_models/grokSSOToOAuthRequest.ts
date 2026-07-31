export interface GrokSSOToOAuthRequest {
  sso_tokens: string[]
  name?: string
  notes?: string
  proxy_id?: number
  group_ids?: number[]
  credentials?: Record<string, unknown>
  extra?: Record<string, unknown>
  concurrency?: number
  load_factor?: number
  priority?: number
  rate_multiplier?: number
  expires_at?: number
  auto_pause_on_expired?: boolean
}
