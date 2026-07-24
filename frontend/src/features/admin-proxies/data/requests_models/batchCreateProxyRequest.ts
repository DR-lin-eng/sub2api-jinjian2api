import type { ProxyProtocol } from '@/features/admin-proxies/domain/models/proxy'

export interface BatchCreateProxyItem {
  protocol: ProxyProtocol
  host: string
  port: number
  username?: string
  password?: string
}

export interface BatchCreateProxyRequest {
  proxies: BatchCreateProxyItem[]
}
