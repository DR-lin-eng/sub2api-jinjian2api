import type { ProxyProtocol } from '@/features/admin-proxies/enums/proxyProtocol'

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
