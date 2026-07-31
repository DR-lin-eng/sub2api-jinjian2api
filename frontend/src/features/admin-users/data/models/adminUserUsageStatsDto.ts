import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AdminUserUsageStats } from '@/features/admin-users/domain/models/adminUserUsageStats'

export class AdminUserUsageStatsDto {
  @Expose({ name: 'total_requests' })
  @Transform(({ value }) => value ?? 0)
  totalRequests!: number

  @Expose({ name: 'total_cost' })
  @Transform(({ value }) => value ?? 0)
  totalCost!: number

  @Expose({ name: 'total_tokens' })
  @Transform(({ value }) => value ?? 0)
  totalTokens!: number

  static fromJson(json: unknown): AdminUserUsageStatsDto {
    return plainToInstance(AdminUserUsageStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminUserUsageStats {
    const entity = new AdminUserUsageStats()
    entity.totalRequests = this.totalRequests
    entity.totalCost = this.totalCost
    entity.totalTokens = this.totalTokens
    return entity
  }
}
