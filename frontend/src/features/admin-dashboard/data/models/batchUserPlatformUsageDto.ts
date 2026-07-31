import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { BatchUserPlatformUsage } from '@/features/admin-dashboard/domain/models/batchUserPlatformUsage'

export class BatchUserPlatformUsageDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  platform!: string

  @Expose({ name: 'today_actual_cost' })
  @Transform(({ value }) => value ?? 0)
  todayActualCost!: number

  @Expose({ name: 'total_actual_cost' })
  @Transform(({ value }) => value ?? 0)
  totalActualCost!: number

  static fromJson(json: unknown): BatchUserPlatformUsageDto {
    return plainToInstance(BatchUserPlatformUsageDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BatchUserPlatformUsage {
    const entity = new BatchUserPlatformUsage()
    entity.platform = this.platform
    entity.todayActualCost = this.todayActualCost
    entity.totalActualCost = this.totalActualCost
    return entity
  }
}
