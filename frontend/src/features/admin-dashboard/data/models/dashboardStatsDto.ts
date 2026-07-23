import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { DashboardStats } from '@/features/admin-dashboard/domain/models/dashboardStats'

export class DashboardStatsDto {
  @Expose({ name: 'total_users' })
  @Transform(({ value }) => value ?? 0)
  totalUsers!: number

  @Expose({ name: 'today_new_users' })
  @Transform(({ value }) => value ?? 0)
  todayNewUsers!: number

  @Expose({ name: 'active_users' })
  @Transform(({ value }) => value ?? 0)
  activeUsers!: number

  @Expose({ name: 'hourly_active_users' })
  @Transform(({ value }) => value ?? 0)
  hourlyActiveUsers!: number

  @Expose({ name: 'stats_updated_at' })
  @Transform(({ value }) => value ?? '')
  statsUpdatedAt!: string

  @Expose({ name: 'stats_stale' })
  @Transform(({ value }) => value ?? false)
  statsStale!: boolean

  @Expose({ name: 'total_api_keys' })
  @Transform(({ value }) => value ?? 0)
  totalApiKeys!: number

  @Expose({ name: 'active_api_keys' })
  @Transform(({ value }) => value ?? 0)
  activeApiKeys!: number

  @Expose({ name: 'total_accounts' })
  @Transform(({ value }) => value ?? 0)
  totalAccounts!: number

  @Expose({ name: 'normal_accounts' })
  @Transform(({ value }) => value ?? 0)
  normalAccounts!: number

  @Expose({ name: 'error_accounts' })
  @Transform(({ value }) => value ?? 0)
  errorAccounts!: number

  @Expose({ name: 'ratelimit_accounts' })
  @Transform(({ value }) => value ?? 0)
  ratelimitAccounts!: number

  @Expose({ name: 'overload_accounts' })
  @Transform(({ value }) => value ?? 0)
  overloadAccounts!: number

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

  @Expose({ name: 'total_account_cost' })
  @Transform(({ value }) => value ?? 0)
  totalAccountCost!: number

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

  @Expose({ name: 'today_account_cost' })
  @Transform(({ value }) => value ?? 0)
  todayAccountCost!: number

  @Expose({ name: 'average_duration_ms' })
  @Transform(({ value }) => value ?? 0)
  averageDurationMs!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  uptime!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  rpm!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  tpm!: number

  static fromJson(json: unknown): DashboardStatsDto {
    return plainToInstance(DashboardStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): DashboardStats {
    const entity = new DashboardStats()
    entity.totalUsers = this.totalUsers
    entity.todayNewUsers = this.todayNewUsers
    entity.activeUsers = this.activeUsers
    entity.hourlyActiveUsers = this.hourlyActiveUsers
    entity.statsUpdatedAt = this.statsUpdatedAt
    entity.statsStale = this.statsStale
    entity.totalApiKeys = this.totalApiKeys
    entity.activeApiKeys = this.activeApiKeys
    entity.totalAccounts = this.totalAccounts
    entity.normalAccounts = this.normalAccounts
    entity.errorAccounts = this.errorAccounts
    entity.ratelimitAccounts = this.ratelimitAccounts
    entity.overloadAccounts = this.overloadAccounts
    entity.totalRequests = this.totalRequests
    entity.totalInputTokens = this.totalInputTokens
    entity.totalOutputTokens = this.totalOutputTokens
    entity.totalCacheCreationTokens = this.totalCacheCreationTokens
    entity.totalCacheReadTokens = this.totalCacheReadTokens
    entity.totalTokens = this.totalTokens
    entity.totalCost = this.totalCost
    entity.totalActualCost = this.totalActualCost
    entity.totalAccountCost = this.totalAccountCost
    entity.todayRequests = this.todayRequests
    entity.todayInputTokens = this.todayInputTokens
    entity.todayOutputTokens = this.todayOutputTokens
    entity.todayCacheCreationTokens = this.todayCacheCreationTokens
    entity.todayCacheReadTokens = this.todayCacheReadTokens
    entity.todayTokens = this.todayTokens
    entity.todayCost = this.todayCost
    entity.todayActualCost = this.todayActualCost
    entity.todayAccountCost = this.todayAccountCost
    entity.averageDurationMs = this.averageDurationMs
    entity.uptime = this.uptime
    entity.rpm = this.rpm
    entity.tpm = this.tpm
    return entity
  }
}
