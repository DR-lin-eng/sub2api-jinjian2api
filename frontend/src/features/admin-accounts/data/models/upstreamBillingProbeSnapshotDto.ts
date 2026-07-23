import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UpstreamBillingProbeSnapshot } from '@/features/admin-accounts/domain/models/upstreamBillingProbeSnapshot'

export class UpstreamBillingProbeSnapshotDto {
  @Expose() @Transform(({ value }) => value ?? 'failed') status!: 'ok' | 'unsupported' | 'failed'
  @Expose() @Transform(({ value }) => value ?? {}) data!: Record<string, unknown>
  @Expose({ name: 'received_at' }) @Transform(({ value }) => value ?? '') receivedAt!: string
  @Expose({ name: 'fresh_until' }) @Transform(({ value }) => value ?? '') freshUntil!: string
  @Expose({ name: 'last_attempt_at' }) @Transform(({ value }) => value ?? '') lastAttemptAt!: string
  @Expose({ name: 'next_probe_at' }) @Transform(({ value }) => value ?? '') nextProbeAt!: string
  @Expose({ name: 'failure_count' }) @Transform(({ value }) => value ?? 0) failureCount!: number
  @Expose({ name: 'http_status' }) @Transform(({ value }) => value ?? 0) httpStatus!: number
  @Expose({ name: 'last_error' }) @Transform(({ value }) => value ?? '') lastError!: string

  static fromJson(json: unknown): UpstreamBillingProbeSnapshotDto {
    return plainToInstance(UpstreamBillingProbeSnapshotDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UpstreamBillingProbeSnapshot {
    const e = new UpstreamBillingProbeSnapshot()
    e.status = this.status
    e.data = this.data
    e.receivedAt = this.receivedAt
    e.freshUntil = this.freshUntil
    e.lastAttemptAt = this.lastAttemptAt
    e.nextProbeAt = this.nextProbeAt
    e.failureCount = this.failureCount
    e.httpStatus = this.httpStatus
    e.lastError = this.lastError
    return e
  }
}
