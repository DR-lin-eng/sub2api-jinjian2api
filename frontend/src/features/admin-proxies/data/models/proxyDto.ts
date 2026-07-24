import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { Proxy } from '@/features/admin-proxies/domain/models/proxy'
import type { ProxyProtocol } from '@/features/admin-proxies/enums/proxyProtocol'
import type { ProxyStatus, ProxyFallbackMode } from '@/features/admin-proxies/enums/proxyEnums'

export class ProxyDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  @Transform(({ value }) => value ?? 'http')
  protocol!: ProxyProtocol

  @Expose()
  @Transform(({ value }) => value ?? '')
  host!: string

  @Expose()
  @Transform(({ value }) => value ?? 0)
  port!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  username!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  password!: string

  @Expose()
  @Transform(({ value }) => value ?? 'inactive')
  status!: ProxyStatus

  @Expose({ name: 'account_count' })
  accountCount?: number

  @Expose({ name: 'latency_ms' })
  latencyMs?: number

  @Expose({ name: 'latency_status' })
  latencyStatus?: 'success' | 'failed'

  @Expose({ name: 'latency_message' })
  latencyMessage?: string

  @Expose({ name: 'ip_address' })
  ipAddress?: string

  @Expose()
  country?: string

  @Expose({ name: 'country_code' })
  countryCode?: string

  @Expose()
  region?: string

  @Expose()
  city?: string

  @Expose({ name: 'quality_status' })
  qualityStatus?: 'healthy' | 'warn' | 'challenge' | 'failed'

  @Expose({ name: 'quality_score' })
  qualityScore?: number

  @Expose({ name: 'quality_grade' })
  qualityGrade?: string

  @Expose({ name: 'quality_summary' })
  qualitySummary?: string

  @Expose({ name: 'quality_checked' })
  qualityChecked?: number

  @Expose({ name: 'expires_at' })
  @Transform(({ value }) => value ?? '')
  expiresAt!: string

  @Expose({ name: 'fallback_mode' })
  @Transform(({ value }) => value ?? 'none')
  fallbackMode!: ProxyFallbackMode

  @Expose({ name: 'backup_proxy_id' })
  @Transform(({ value }) => value ?? 0)
  backupProxyId!: number

  @Expose({ name: 'expiry_warn_days' })
  @Transform(({ value }) => value ?? 0)
  expiryWarnDays!: number

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => value ?? '')
  updatedAt!: string

  static fromJson(json: unknown): ProxyDto {
    return plainToInstance(ProxyDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): Proxy {
    const entity = new Proxy()
    entity.id = this.id
    entity.name = this.name
    entity.protocol = this.protocol
    entity.host = this.host
    entity.port = this.port
    entity.username = this.username
    entity.password = this.password
    entity.status = this.status
    entity.accountCount = this.accountCount
    entity.latencyMs = this.latencyMs
    entity.latencyStatus = this.latencyStatus
    entity.latencyMessage = this.latencyMessage
    entity.ipAddress = this.ipAddress
    entity.country = this.country
    entity.countryCode = this.countryCode
    entity.region = this.region
    entity.city = this.city
    entity.qualityStatus = this.qualityStatus
    entity.qualityScore = this.qualityScore
    entity.qualityGrade = this.qualityGrade
    entity.qualitySummary = this.qualitySummary
    entity.qualityChecked = this.qualityChecked
    entity.expiresAt = this.expiresAt
    entity.fallbackMode = this.fallbackMode
    entity.backupProxyId = this.backupProxyId
    entity.expiryWarnDays = this.expiryWarnDays
    entity.createdAt = this.createdAt
    entity.updatedAt = this.updatedAt
    return entity
  }
}
