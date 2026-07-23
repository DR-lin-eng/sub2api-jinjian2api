import type { ProxyQualityCheckResult, ProxyQualityCheckItem } from '@/features/admin-proxies/domain/models/proxy'

interface ProxyQualityCheckItemDto {
  target: string
  status: 'pass' | 'warn' | 'fail' | 'challenge'
  http_status?: number
  latency_ms?: number
  message?: string
  cf_ray?: string
}

function itemToEntity(dto: ProxyQualityCheckItemDto): ProxyQualityCheckItem {
  return {
    target: dto.target ?? '',
    status: dto.status ?? 'fail',
    httpStatus: dto.http_status,
    latencyMs: dto.latency_ms,
    message: dto.message,
    cfRay: dto.cf_ray,
  }
}

export interface ProxyQualityCheckResultDto {
  proxy_id: number
  score: number
  grade: string
  summary: string
  exit_ip?: string
  country?: string
  country_code?: string
  base_latency_ms?: number
  passed_count: number
  warn_count: number
  failed_count: number
  challenge_count: number
  checked_at: number
  items: ProxyQualityCheckItemDto[]
}

export function toEntity(dto: ProxyQualityCheckResultDto): ProxyQualityCheckResult {
  return {
    proxyId: dto.proxy_id ?? 0,
    score: dto.score ?? 0,
    grade: dto.grade ?? '',
    summary: dto.summary ?? '',
    exitIp: dto.exit_ip,
    country: dto.country,
    countryCode: dto.country_code,
    baseLatencyMs: dto.base_latency_ms,
    passedCount: dto.passed_count ?? 0,
    warnCount: dto.warn_count ?? 0,
    failedCount: dto.failed_count ?? 0,
    challengeCount: dto.challenge_count ?? 0,
    checkedAt: dto.checked_at ?? 0,
    items: (dto.items ?? []).map(itemToEntity),
  }
}
