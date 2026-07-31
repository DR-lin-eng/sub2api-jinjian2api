// HTTP request body — snake_case, matches backend contract. No transformation.

export interface UpdateApiKeyRequest {
  name?: string
  group_id?: number | null
  status?: 'active' | 'inactive'
  ip_whitelist?: string[]
  ip_blacklist?: string[]
  quota?: number
  expires_at?: string | null
  reset_quota?: boolean
  concurrency_limit?: number
  rate_limit_5h?: number
  rate_limit_1d?: number
  rate_limit_7d?: number
  reset_rate_limit_usage?: boolean
}
