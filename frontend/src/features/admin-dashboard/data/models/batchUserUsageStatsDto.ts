import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { BatchUserUsageStats } from '@/features/admin-dashboard/domain/models/batchUserUsageStats'

export class BatchUserUsageStatsDto {
  @Expose({ name: 'user_id' })
  @Transform(({ value }) => value ?? 0)
  userId!: number

  @Expose({ name: 'today_actual_cost' })
  @Transform(({ value }) => value ?? 0)
  todayActualCost!: number

  @Expose({ name: 'total_actual_cost' })
  @Transform(({ value }) => value ?? 0)
  totalActualCost!: number

  static fromJson(json: unknown): BatchUserUsageStatsDto {
    return plainToInstance(BatchUserUsageStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BatchUserUsageStats {
    const entity = new BatchUserUsageStats()
    entity.userId = this.userId
    entity.todayActualCost = this.todayActualCost
    entity.totalActualCost = this.totalActualCost
    return entity
  }
}
