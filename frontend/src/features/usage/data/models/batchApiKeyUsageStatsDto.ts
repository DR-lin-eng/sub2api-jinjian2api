import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { BatchApiKeyUsageStats } from '@/features/usage/domain/models/batchApiKeyUsageStats'

export class BatchApiKeyUsageStatsDto {
  @Expose({ name: 'api_key_id' })
  @Transform(({ value }) => value ?? 0)
  apiKeyId!: number

  @Expose({ name: 'today_actual_cost' })
  @Transform(({ value }) => value ?? 0)
  todayActualCost!: number

  @Expose({ name: 'total_actual_cost' })
  @Transform(({ value }) => value ?? 0)
  totalActualCost!: number

  @Expose({ name: 'total_tokens' })
  @Transform(({ value }) => value ?? 0)
  totalTokens!: number

  static fromJson(json: unknown): BatchApiKeyUsageStatsDto {
    return plainToInstance(BatchApiKeyUsageStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BatchApiKeyUsageStats {
    const entity = new BatchApiKeyUsageStats()
    entity.apiKeyId = this.apiKeyId
    entity.todayActualCost = this.todayActualCost
    entity.totalActualCost = this.totalActualCost
    entity.totalTokens = this.totalTokens
    return entity
  }
}
