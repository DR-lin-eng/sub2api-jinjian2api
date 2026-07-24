import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { ProxyQualityCheckResult } from '@/features/admin-proxies/domain/models/proxyQualityCheckResult'
import { ProxyQualityCheckItemDto } from '@/features/admin-proxies/data/models/proxyQualityCheckItemDto'

export class ProxyQualityCheckResultDto {
  @Expose({ name: 'proxy_id' })
  @Transform(({ value }) => value ?? 0)
  proxyId!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  score!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  grade!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  summary!: string

  @Expose({ name: 'exit_ip' })
  exitIp?: string

  @Expose()
  country?: string

  @Expose({ name: 'country_code' })
  countryCode?: string

  @Expose({ name: 'base_latency_ms' })
  baseLatencyMs?: number

  @Expose({ name: 'passed_count' })
  @Transform(({ value }) => value ?? 0)
  passedCount!: number

  @Expose({ name: 'warn_count' })
  @Transform(({ value }) => value ?? 0)
  warnCount!: number

  @Expose({ name: 'failed_count' })
  @Transform(({ value }) => value ?? 0)
  failedCount!: number

  @Expose({ name: 'challenge_count' })
  @Transform(({ value }) => value ?? 0)
  challengeCount!: number

  @Expose({ name: 'checked_at' })
  @Transform(({ value }) => value ?? 0)
  checkedAt!: number

  @Expose()
  @Transform(({ value }) => value ?? [])
  @Type(() => ProxyQualityCheckItemDto)
  items!: ProxyQualityCheckItemDto[]

  static fromJson(json: unknown): ProxyQualityCheckResultDto {
    return plainToInstance(ProxyQualityCheckResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ProxyQualityCheckResult {
    const entity = new ProxyQualityCheckResult()
    entity.proxyId = this.proxyId
    entity.score = this.score
    entity.grade = this.grade
    entity.summary = this.summary
    entity.exitIp = this.exitIp
    entity.country = this.country
    entity.countryCode = this.countryCode
    entity.baseLatencyMs = this.baseLatencyMs
    entity.passedCount = this.passedCount
    entity.warnCount = this.warnCount
    entity.failedCount = this.failedCount
    entity.challengeCount = this.challengeCount
    entity.checkedAt = this.checkedAt
    entity.items = (this.items ?? []).map(i => i.toEntity())
    return entity
  }
}
