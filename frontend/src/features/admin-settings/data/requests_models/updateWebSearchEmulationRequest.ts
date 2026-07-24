export interface UpdateWebSearchEmulationRequest {
  enabled: boolean
  providers: Array<{
    type: 'brave' | 'tavily'
    api_key?: string
    quota_limit?: number | null
    proxy_id?: number | null
    expires_at?: number | null
  }>
}
