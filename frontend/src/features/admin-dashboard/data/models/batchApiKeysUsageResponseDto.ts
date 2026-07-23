import 'reflect-metadata'
import { Expose, plainToInstance } from 'class-transformer'
import { BatchApiKeysUsageResponse } from '@/features/admin-dashboard/domain/models/batchApiKeysUsageResponse'
import { BatchApiKeyUsageStatsDto } from './batchApiKeyUsageStatsDto'

export class BatchApiKeysUsageResponseDto {
  @Expose()
  stats!: Record<string, unknown>

  static fromJson(json: unknown): BatchApiKeysUsageResponseDto {
    return plainToInstance(BatchApiKeysUsageResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BatchApiKeysUsageResponse {
    const entity = new BatchApiKeysUsageResponse()
    entity.stats = {}
    if (this.stats) {
      for (const [key, value] of Object.entries(this.stats)) {
        entity.stats[key] = BatchApiKeyUsageStatsDto.fromJson(value).toEntity()
      }
    }
    return entity
  }
}
