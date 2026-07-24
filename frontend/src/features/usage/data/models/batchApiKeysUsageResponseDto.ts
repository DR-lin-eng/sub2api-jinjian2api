import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { BatchApiKeysUsageResponse } from '@/features/usage/domain/models/batchApiKeysUsageResponse'
import { BatchApiKeyUsageStatsDto } from './batchApiKeyUsageStatsDto'

export class BatchApiKeysUsageResponseDto {
  @Expose()
  @Transform(({ value }) => {
    if (!value || typeof value !== 'object') return {}
    const result: Record<string, BatchApiKeyUsageStatsDto> = {}
    for (const [k, v] of Object.entries(value)) {
      result[k] = BatchApiKeyUsageStatsDto.fromJson(v)
    }
    return result
  })
  stats!: Record<string, BatchApiKeyUsageStatsDto>

  static fromJson(json: unknown): BatchApiKeysUsageResponseDto {
    return plainToInstance(BatchApiKeysUsageResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BatchApiKeysUsageResponse {
    const entity = new BatchApiKeysUsageResponse()
    const result: BatchApiKeysUsageResponse['stats'] = {}
    for (const [k, v] of Object.entries(this.stats ?? {})) {
      result[k] = v.toEntity()
    }
    entity.stats = result
    return entity
  }
}
