import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { UsageProgress } from '@/features/admin-accounts/domain/models/usageProgress'
import { WindowStatsDto } from '@/features/admin-accounts/data/models/windowStatsDto'

export class UsageProgressDto {
  @Expose() @Transform(({ value }) => value ?? 0) utilization!: number
  @Expose({ name: 'resets_at' }) @Transform(({ value }) => value ?? '') resetsAt!: string
  @Expose({ name: 'remaining_seconds' }) @Transform(({ value }) => value ?? 0) remainingSeconds!: number
  @Expose({ name: 'window_stats' }) @Type(() => WindowStatsDto) windowStats?: WindowStatsDto
  @Expose({ name: 'used_requests' }) @Transform(({ value }) => value ?? 0) usedRequests!: number
  @Expose({ name: 'limit_requests' }) @Transform(({ value }) => value ?? 0) limitRequests!: number

  static fromJson(json: unknown): UsageProgressDto {
    return plainToInstance(UsageProgressDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UsageProgress {
    const e = new UsageProgress()
    e.utilization = this.utilization
    e.resetsAt = this.resetsAt
    e.remainingSeconds = this.remainingSeconds
    e.windowStats = this.windowStats ? this.windowStats.toEntity() : undefined
    e.usedRequests = this.usedRequests
    e.limitRequests = this.limitRequests
    return e
  }
}
