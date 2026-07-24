import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PlatformDashboardStats } from '@/features/usage/domain/models/platformDashboardStats'

export class PlatformDashboardStatsDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  platform!: string

  @Expose({ name: 'total_requests' })
  @Transform(({ value }) => value ?? 0)
  totalRequests!: number

  @Expose({ name: 'total_tokens' })
  @Transform(({ value }) => value ?? 0)
  totalTokens!: number

  @Expose({ name: 'total_actual_cost' })
  @Transform(({ value }) => value ?? 0)
  totalActualCost!: number

  @Expose({ name: 'today_requests' })
  @Transform(({ value }) => value ?? 0)
  todayRequests!: number

  @Expose({ name: 'today_tokens' })
  @Transform(({ value }) => value ?? 0)
  todayTokens!: number

  @Expose({ name: 'today_actual_cost' })
  @Transform(({ value }) => value ?? 0)
  todayActualCost!: number

  static fromJson(json: unknown): PlatformDashboardStatsDto {
    return plainToInstance(PlatformDashboardStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PlatformDashboardStats {
    const entity = new PlatformDashboardStats()
    entity.platform = this.platform
    entity.totalRequests = this.totalRequests
    entity.totalTokens = this.totalTokens
    entity.totalActualCost = this.totalActualCost
    entity.todayRequests = this.todayRequests
    entity.todayTokens = this.todayTokens
    entity.todayActualCost = this.todayActualCost
    return entity
  }
}
