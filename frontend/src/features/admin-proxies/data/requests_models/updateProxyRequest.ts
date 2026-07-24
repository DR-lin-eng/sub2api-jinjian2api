import type { ProxyProtocol, ProxyStatus, ProxyFallbackMode } from '@/features/admin-proxies/domain/models/proxy'

export interface UpdateProxyRequest {
  name?: string
  protocol?: ProxyProtocol
  host?: string
  port?: number
  username?: string
  password?: string
  status?: ProxyStatus
  expires_at?: number | null
  fallback_mode?: ProxyFallbackMode
  backup_proxy_id?: number | null
  expiry_warn_days?: number
}
