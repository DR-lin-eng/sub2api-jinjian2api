import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import type { GrokBillingSummary } from '@/features/admin-accounts/domain/models/grokBillingSummary'
import { GrokQuotaProbeResult } from '@/features/admin-accounts/domain/models/grokQuotaProbeResult'
import { GrokQuotaSnapshotDto } from '@/features/admin-accounts/data/models/grokQuotaSnapshotDto'
import { WindowStatsDto } from '@/features/admin-accounts/data/models/windowStatsDto'

export class GrokQuotaProbeResultDto {
  @Expose() @Transform(({ value }) => value ?? 'active_probe') source!: 'active_probe' | 'billing_probe' | 'hybrid_probe'
  @Expose() @Transform(({ value }) => value ?? '') model!: string
  @Expose() billing?: GrokBillingSummary
  @Expose() @Type(() => GrokQuotaSnapshotDto) snapshot?: GrokQuotaSnapshotDto
  @Expose({ name: 'local_usage_24h' }) @Type(() => WindowStatsDto) localUsage24h?: WindowStatsDto
  @Expose({ name: 'local_usage_7d' }) @Type(() => WindowStatsDto) localUsage7d?: WindowStatsDto
  @Expose({ name: 'local_usage_monthly' }) @Type(() => WindowStatsDto) localUsageMonthly?: WindowStatsDto
  @Expose({ name: 'status_code' }) @Transform(({ value }) => value ?? 0) statusCode!: number
  @Expose({ name: 'headers_observed' }) @Transform(({ value }) => value ?? false) headersObserved!: boolean
  @Expose({ name: 'reset_supported' }) @Transform(({ value }) => value ?? false) resetSupported!: boolean
  @Expose({ name: 'fetched_at' }) @Transform(({ value }) => value ?? 0) fetchedAt!: number
  @Expose() @Transform(({ value }) => value ?? false) persisted!: boolean
  @Expose({ name: 'probe_error' }) @Transform(({ value }) => value ?? '') probeError!: string

  static fromJson(json: unknown): GrokQuotaProbeResultDto {
    return plainToInstance(GrokQuotaProbeResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GrokQuotaProbeResult {
    const e = new GrokQuotaProbeResult()
    e.source = this.source
    e.model = this.model
    e.billing = this.billing
    e.snapshot = this.snapshot ? this.snapshot.toEntity() : undefined
    e.localUsage24h = this.localUsage24h ? this.localUsage24h.toEntity() : undefined
    e.localUsage7d = this.localUsage7d ? this.localUsage7d.toEntity() : undefined
    e.localUsageMonthly = this.localUsageMonthly ? this.localUsageMonthly.toEntity() : undefined
    e.statusCode = this.statusCode
    e.headersObserved = this.headersObserved
    e.resetSupported = this.resetSupported
    e.fetchedAt = this.fetchedAt
    e.persisted = this.persisted
    e.probeError = this.probeError
    return e
  }
}
