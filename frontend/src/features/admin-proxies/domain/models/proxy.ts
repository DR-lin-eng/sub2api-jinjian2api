import type { AccountPlatform, AccountType } from '@/types'
import type { ProxyProtocol } from '@/types'

export type { ProxyProtocol }

export interface Proxy {
  id: number
  name: string
  protocol: ProxyProtocol
  host: string
  port: number
  username: string | null
  password?: string | null
  status: 'active' | 'inactive' | 'expired'
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
  expiresAt: string | null
  fallbackMode: 'none' | 'proxy' | 'direct'
  backupProxyId?: number | null
  expiryWarnDays: number
  createdAt: string
  updatedAt: string
}

export interface ProxyAccountSummary {
  id: number
  name: string
  platform: AccountPlatform
  type: AccountType
  notes?: string | null
}

export interface ProxyQualityCheckItem {
  target: string
  status: 'pass' | 'warn' | 'fail' | 'challenge'
  httpStatus?: number
  latencyMs?: number
  message?: string
  cfRay?: string
}

export interface ProxyQualityCheckResult {
  proxyId: number
  score: number
  grade: string
  summary: string
  exitIp?: string
  country?: string
  countryCode?: string
  baseLatencyMs?: number
  passedCount: number
  warnCount: number
  failedCount: number
  challengeCount: number
  checkedAt: number
  items: ProxyQualityCheckItem[]
}

export interface CreateProxyRequest {
  name: string
  protocol: ProxyProtocol
  host: string
  port: number
  username?: string | null
  password?: string | null
  expiresAt?: number | null
  fallbackMode?: 'none' | 'proxy' | 'direct'
  backupProxyId?: number | null
  expiryWarnDays?: number
}

export interface UpdateProxyRequest {
  name?: string
  protocol?: ProxyProtocol
  host?: string
  port?: number
  username?: string | null
  password?: string | null
  status?: 'active' | 'inactive'
  expiresAt?: number | null
  fallbackMode?: 'none' | 'proxy' | 'direct'
  backupProxyId?: number | null
  expiryWarnDays?: number
}
