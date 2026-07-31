import type { ProxyProtocol } from '@/features/admin-proxies/enums/proxyProtocol'
import type { ProxyStatus, ProxyFallbackMode } from '@/features/admin-proxies/enums/proxyEnums'

export class Proxy {
  id!: number
  name!: string
  protocol!: ProxyProtocol
  host!: string
  port!: number
  username!: string
  password!: string
  status!: ProxyStatus
  accountCount?: number
  latencyMs?: number
  latencyStatus?: 'success' | 'failed'
  latencyMessage?: string
  ipAddress?: string
  country?: string
  countryCode?: string
  region?: string
  city?: string
  qualityStatus?: 'healthy' | 'warn' | 'challenge' | 'failed'
  qualityScore?: number
  qualityGrade?: string
  qualitySummary?: string
  qualityChecked?: number
  expiresAt!: string
  fallbackMode!: ProxyFallbackMode
  backupProxyId!: number
  expiryWarnDays!: number
  createdAt!: string
  updatedAt!: string
}
