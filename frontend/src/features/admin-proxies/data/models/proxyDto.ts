import type { Proxy } from '@/features/admin-proxies/domain/models/proxy'
import type { ProxyProtocol } from '@/features/admin-proxies/domain/models/proxy'
export interface ProxyDto {
  id: number
  name: string
  protocol: ProxyProtocol
  host: string
  port: number
  username: string | null
  password?: string | null
  status: 'active' | 'inactive' | 'expired'
  account_count?: number
  latency_ms?: number
  latency_status?: 'success' | 'failed'
  latency_message?: string
  ip_address?: string
  country?: string
  country_code?: string
  region?: string
  city?: string
  quality_status?: 'healthy' | 'warn' | 'challenge' | 'failed'
  quality_score?: number
  quality_grade?: string
  quality_summary?: string
  quality_checked?: number
  expires_at: string | null
  fallback_mode: 'none' | 'proxy' | 'direct'
  backup_proxy_id?: number | null
  expiry_warn_days: number
  created_at: string
  updated_at: string
}

export function toEntity(dto: ProxyDto): Proxy {
  return {
    id: dto.id ?? 0,
    name: dto.name ?? '',
    protocol: dto.protocol ?? 'http',
    host: dto.host ?? '',
    port: dto.port ?? 0,
    username: dto.username ?? null,
    password: dto.password,
    status: dto.status ?? 'inactive',
    accountCount: dto.account_count,
    latencyMs: dto.latency_ms,
    latencyStatus: dto.latency_status,
    latencyMessage: dto.latency_message,
    ipAddress: dto.ip_address,
    country: dto.country,
    countryCode: dto.country_code,
    region: dto.region,
    city: dto.city,
    qualityStatus: dto.quality_status,
    qualityScore: dto.quality_score,
    qualityGrade: dto.quality_grade,
    qualitySummary: dto.quality_summary,
    qualityChecked: dto.quality_checked,
    expiresAt: dto.expires_at ?? null,
    fallbackMode: dto.fallback_mode ?? 'none',
    backupProxyId: dto.backup_proxy_id,
    expiryWarnDays: dto.expiry_warn_days ?? 0,
    createdAt: dto.created_at ?? '',
    updatedAt: dto.updated_at ?? '',
  }
}
