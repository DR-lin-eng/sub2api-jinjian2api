import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { GrokQuotaSnapshot } from '@/features/admin-accounts/domain/models/grokQuotaSnapshot'

export class GrokQuotaSnapshotDto {
  @Expose() requests?: unknown
  @Expose() tokens?: unknown
  @Expose({ name: 'retry_after_seconds' }) @Transform(({ value }) => value ?? 0) retryAfterSeconds!: number
  @Expose({ name: 'subscription_tier' }) @Transform(({ value }) => value ?? '') subscriptionTier!: string
  @Expose({ name: 'entitlement_status' }) @Transform(({ value }) => value ?? '') entitlementStatus!: string
  @Expose({ name: 'status_code' }) @Transform(({ value }) => value ?? 0) statusCode!: number
  @Expose() @Transform(({ value }) => value ?? {}) headers!: Record<string, string>
  @Expose({ name: 'headers_observed' }) @Transform(({ value }) => value ?? false) headersObserved!: boolean
  @Expose({ name: 'observation_source' }) @Transform(({ value }) => value ?? '') observationSource!: string
  @Expose({ name: 'last_probe_at' }) @Transform(({ value }) => value ?? '') lastProbeAt!: string
  @Expose({ name: 'last_headers_seen_at' }) @Transform(({ value }) => value ?? '') lastHeadersSeenAt!: string
  @Expose({ name: 'updated_at' }) @Transform(({ value }) => value ?? '') updatedAt!: string

  static fromJson(json: unknown): GrokQuotaSnapshotDto {
    return plainToInstance(GrokQuotaSnapshotDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GrokQuotaSnapshot {
    const e = new GrokQuotaSnapshot()
    e.requests = this.requests as never
    e.tokens = this.tokens as never
    e.retryAfterSeconds = this.retryAfterSeconds
    e.subscriptionTier = this.subscriptionTier
    e.entitlementStatus = this.entitlementStatus
    e.statusCode = this.statusCode
    e.headers = this.headers
    e.headersObserved = this.headersObserved
    e.observationSource = this.observationSource
    e.lastProbeAt = this.lastProbeAt
    e.lastHeadersSeenAt = this.lastHeadersSeenAt
    e.updatedAt = this.updatedAt
    return e
  }
}
