import 'reflect-metadata'
import { Expose, Transform, plainToInstance, Type } from 'class-transformer'
import { UserDashboardStats } from '@/features/usage/domain/models/userDashboardStats'
import { PlatformDashboardStatsDto } from './platformDashboardStatsDto'

export class UserDashboardStatsDto {
  @Expose({ name: 'total_api_keys' })
  @Transform(({ value }) => value ?? 0)
  totalApiKeys!: number

  @Expose({ name: 'active_api_keys' })
  @Transform(({ value }) => value ?? 0)
  activeApiKeys!: number

  @Expose({ name: 'total_requests' })
  @Transform(({ value }) => value ?? 0)
  totalRequests!: number

  @Expose({ name: 'total_input_tokens' })
  @Transform(({ value }) => value ?? 0)
  totalInputTokens!: number

  @Expose({ name: 'total_output_tokens' })
  @Transform(({ value }) => value ?? 0)
  totalOutputTokens!: number

  @Expose({ name: 'total_cache_creation_tokens' })
  @Transform(({ value }) => value ?? 0)
  totalCacheCreationTokens!: number

  @Expose({ name: 'total_cache_read_tokens' })
  @Transform(({ value }) => value ?? 0)
  totalCacheReadTokens!: number

  @Expose({ name: 'total_tokens' })
  @Transform(({ value }) => value ?? 0)
  totalTokens!: number

  @Expose({ name: 'total_cost' })
  @Transform(({ value }) => value ?? 0)
  totalCost!: number

  @Expose({ name: 'total_actual_cost' })
  @Transform(({ value }) => value ?? 0)
  totalActualCost!: number

  @Expose({ name: 'today_requests' })
  @Transform(({ value }) => value ?? 0)
  todayRequests!: number

  @Expose({ name: 'today_input_tokens' })
  @Transform(({ value }) => value ?? 0)
  todayInputTokens!: number

  @Expose({ name: 'today_output_tokens' })
  @Transform(({ value }) => value ?? 0)
  todayOutputTokens!: number

  @Expose({ name: 'today_cache_creation_tokens' })
  @Transform(({ value }) => value ?? 0)
  todayCacheCreationTokens!: number

  @Expose({ name: 'today_cache_read_tokens' })
  @Transform(({ value }) => value ?? 0)
  todayCacheReadTokens!: number

  @Expose({ name: 'today_tokens' })
  @Transform(({ value }) => value ?? 0)
  todayTokens!: number

  @Expose({ name: 'today_cost' })
  @Transform(({ value }) => value ?? 0)
  todayCost!: number

  @Expose({ name: 'today_actual_cost' })
  @Transform(({ value }) => value ?? 0)
  todayActualCost!: number

  @Expose({ name: 'average_duration_ms' })
  @Transform(({ value }) => value ?? 0)
  averageDurationMs!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  rpm!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  tpm!: number

  @Expose({ name: 'by_platform' })
  @Type(() => PlatformDashboardStatsDto)
  byPlatform?: PlatformDashboardStatsDto[]

  static fromJson(json: unknown): UserDashboardStatsDto {
    return plainToInstance(UserDashboardStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserDashboardStats {
    const entity = new UserDashboardStats()
    entity.totalApiKeys = this.totalApiKeys
    entity.activeApiKeys = this.activeApiKeys
    entity.totalRequests = this.totalRequests
    entity.totalInputTokens = this.totalInputTokens
    entity.totalOutputTokens = this.totalOutputTokens
    entity.totalCacheCreationTokens = this.totalCacheCreationTokens
    entity.totalCacheReadTokens = this.totalCacheReadTokens
    entity.totalTokens = this.totalTokens
    entity.totalCost = this.totalCost
    entity.totalActualCost = this.totalActualCost
    entity.todayRequests = this.todayRequests
    entity.todayInputTokens = this.todayInputTokens
    entity.todayOutputTokens = this.todayOutputTokens
    entity.todayCacheCreationTokens = this.todayCacheCreationTokens
    entity.todayCacheReadTokens = this.todayCacheReadTokens
    entity.todayTokens = this.todayTokens
    entity.todayCost = this.todayCost
    entity.todayActualCost = this.todayActualCost
    entity.averageDurationMs = this.averageDurationMs
    entity.rpm = this.rpm
    entity.tpm = this.tpm
    entity.byPlatform = this.byPlatform?.map(d => d.toEntity())
    return entity
  }
}
