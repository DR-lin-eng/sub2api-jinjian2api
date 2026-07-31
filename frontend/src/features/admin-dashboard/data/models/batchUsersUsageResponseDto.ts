import 'reflect-metadata'
import { Expose, plainToInstance } from 'class-transformer'
import { BatchUsersUsageResponse } from '@/features/admin-dashboard/domain/models/batchUsersUsageResponse'
import { BatchUserUsageStatsDto } from './batchUserUsageStatsDto'

export class BatchUsersUsageResponseDto {
  @Expose()
  stats!: Record<string, unknown>

  static fromJson(json: unknown): BatchUsersUsageResponseDto {
    return plainToInstance(BatchUsersUsageResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BatchUsersUsageResponse {
    const entity = new BatchUsersUsageResponse()
    entity.stats = {}
    if (this.stats) {
      for (const [key, value] of Object.entries(this.stats)) {
        entity.stats[key] = BatchUserUsageStatsDto.fromJson(value).toEntity()
      }
    }
    return entity
  }
}
