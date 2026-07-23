import type { UpdateProxyRequest } from '@/features/admin-proxies/domain/models/proxy'
import type { ProxyProtocol } from '@/features/admin-proxies/domain/models/proxy'
export interface UpdateProxyRequestDto {
  name?: string
  protocol?: ProxyProtocol
  host?: string
  port?: number
  username?: string | null
  password?: string | null
  status?: 'active' | 'inactive'
  expires_at?: number | null
  fallback_mode?: 'none' | 'proxy' | 'direct'
  backup_proxy_id?: number | null
  expiry_warn_days?: number
}

export function toEntity(dto: UpdateProxyRequestDto): UpdateProxyRequest {
  return {
    name: dto.name,
    protocol: dto.protocol,
    host: dto.host,
    port: dto.port,
    username: dto.username,
    password: dto.password,
    status: dto.status,
    expiresAt: dto.expires_at,
    fallbackMode: dto.fallback_mode,
    backupProxyId: dto.backup_proxy_id,
    expiryWarnDays: dto.expiry_warn_days,
  }
}
