import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpsImageGenerationRealtime, OpsImageGenerationResolutionStats, OpsImageGenerationStats } from '@/features/admin-ops/domain/models/opsImageGenerationStats'

export class OpsImageGenerationRealtimeDto {
  @Expose() @Transform(({ value }) => value ?? false) available!: boolean
  @Expose() @Transform(({ value }) => value ?? '') scope!: string
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose({ name: 'current_concurrent' }) @Transform(({ value }) => value ?? 0) currentConcurrent!: number
  @Expose() @Transform(({ value }) => value ?? 0) waiting!: number
  @Expose() @Transform(({ value }) => value ?? 0) limit!: number
  @Expose({ name: 'max_waiting' }) @Transform(({ value }) => value ?? 0) maxWaiting!: number

  static fromJson(json: unknown): OpsImageGenerationRealtimeDto {
    return plainToInstance(OpsImageGenerationRealtimeDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsImageGenerationRealtime {
    const e = new OpsImageGenerationRealtime()
    e.available = this.available
    e.scope = this.scope
    e.enabled = this.enabled
    e.currentConcurrent = this.currentConcurrent
    e.waiting = this.waiting
    e.limit = this.limit
    e.maxWaiting = this.maxWaiting
    return e
  }
}

export class OpsImageGenerationResolutionStatsDto {
  @Expose() @Transform(({ value }) => value ?? '') resolution!: string
  @Expose({ name: 'billing_tier' }) @Transform(({ value }) => value ?? '') billingTier!: string
  @Expose({ name: 'request_count' }) @Transform(({ value }) => value ?? 0) requestCount!: number
  @Expose({ name: 'image_count' }) @Transform(({ value }) => value ?? 0) imageCount!: number
  @Expose({ name: 'avg_duration_ms' }) @Transform(({ value }) => value ?? 0) avgDurationMs!: number
  @Expose({ name: 'p95_duration_ms' }) @Transform(({ value }) => value ?? 0) p95DurationMs!: number
  @Expose({ name: 'max_duration_ms' }) @Transform(({ value }) => value ?? 0) maxDurationMs!: number

  static fromJson(json: unknown): OpsImageGenerationResolutionStatsDto {
    return plainToInstance(OpsImageGenerationResolutionStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsImageGenerationResolutionStats {
    const e = new OpsImageGenerationResolutionStats()
    e.resolution = this.resolution
    e.billingTier = this.billingTier
    e.requestCount = this.requestCount
    e.imageCount = this.imageCount
    e.avgDurationMs = this.avgDurationMs
    e.p95DurationMs = this.p95DurationMs
    e.maxDurationMs = this.maxDurationMs
    return e
  }
}

export class OpsImageGenerationStatsDto {
  @Expose({ name: 'start_time' }) @Transform(({ value }) => value ?? '') startTime!: string
  @Expose({ name: 'end_time' }) @Transform(({ value }) => value ?? '') endTime!: string
  @Expose() @Transform(({ value }) => value ?? '') platform!: string
  @Expose({ name: 'group_id' }) @Transform(({ value }) => value ?? 0) groupId!: number
  @Expose({ name: 'request_count' }) @Transform(({ value }) => value ?? 0) requestCount!: number
  @Expose({ name: 'image_count' }) @Transform(({ value }) => value ?? 0) imageCount!: number
  @Expose({ name: 'requests_per_minute' }) @Transform(({ value }) => value ?? 0) requestsPerMinute!: number
  @Expose({ name: 'avg_duration_ms' }) @Transform(({ value }) => value ?? 0) avgDurationMs!: number
  @Expose({ name: 'p95_duration_ms' }) @Transform(({ value }) => value ?? 0) p95DurationMs!: number
  @Expose({ name: 'max_duration_ms' }) @Transform(({ value }) => value ?? 0) maxDurationMs!: number
  @Expose({ name: 'average_concurrent' }) @Transform(({ value }) => value ?? 0) averageConcurrent!: number
  @Expose({ name: 'peak_concurrent' }) @Transform(({ value }) => value ?? 0) peakConcurrent!: number
  @Expose() @Type(() => OpsImageGenerationRealtimeDto) realtime!: OpsImageGenerationRealtimeDto
  @Expose({ name: 'by_resolution' }) @Type(() => OpsImageGenerationResolutionStatsDto) @Transform(({ value }) => value ?? []) byResolution!: OpsImageGenerationResolutionStatsDto[]

  static fromJson(json: unknown): OpsImageGenerationStatsDto {
    return plainToInstance(OpsImageGenerationStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsImageGenerationStats {
    const e = new OpsImageGenerationStats()
    e.startTime = this.startTime
    e.endTime = this.endTime
    e.platform = this.platform
    e.groupId = this.groupId
    e.requestCount = this.requestCount
    e.imageCount = this.imageCount
    e.requestsPerMinute = this.requestsPerMinute
    e.avgDurationMs = this.avgDurationMs
    e.p95DurationMs = this.p95DurationMs
    e.maxDurationMs = this.maxDurationMs
    e.averageConcurrent = this.averageConcurrent
    e.peakConcurrent = this.peakConcurrent
    e.realtime = this.realtime?.toEntity() ?? new OpsImageGenerationRealtime()
    e.byResolution = (this.byResolution ?? []).map(d => d.toEntity())
    return e
  }
}
