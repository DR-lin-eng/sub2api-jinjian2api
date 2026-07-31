import type { ProxyProtocol } from '@/features/admin-proxies/enums/proxyProtocol'
import type { ProxyFallbackMode } from '@/features/admin-proxies/enums/proxyEnums'

export interface CreateProxyRequest {
  name: string
  protocol: ProxyProtocol
  host: string
  port: number
  username?: string
  password?: string
  expires_at?: number | null
  fallback_mode?: ProxyFallbackMode
  backup_proxy_id?: number | null
  expiry_warn_days?: number
}
