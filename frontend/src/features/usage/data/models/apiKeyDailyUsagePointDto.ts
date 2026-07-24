import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ApiKeyDailyUsagePoint } from '@/features/usage/domain/models/apiKeyDailyUsagePoint'

export class ApiKeyDailyUsagePointDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  date!: string

  @Expose()
  @Transform(({ value }) => value ?? 0)
  requests!: number

  @Expose({ name: 'input_tokens' })
  @Transform(({ value }) => value ?? 0)
  inputTokens!: number

  @Expose({ name: 'output_tokens' })
  @Transform(({ value }) => value ?? 0)
  outputTokens!: number

  @Expose({ name: 'cache_read_tokens' })
  @Transform(({ value }) => value ?? 0)
  cacheReadTokens!: number

  @Expose({ name: 'cache_write_tokens' })
  @Transform(({ value }) => value ?? 0)
  cacheWriteTokens!: number

  @Expose({ name: 'total_tokens' })
  @Transform(({ value }) => value ?? 0)
  totalTokens!: number

  static fromJson(json: unknown): ApiKeyDailyUsagePointDto {
    return plainToInstance(ApiKeyDailyUsagePointDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ApiKeyDailyUsagePoint {
    const entity = new ApiKeyDailyUsagePoint()
    entity.date = this.date
    entity.requests = this.requests
    entity.inputTokens = this.inputTokens
    entity.outputTokens = this.outputTokens
    entity.cacheReadTokens = this.cacheReadTokens
    entity.cacheWriteTokens = this.cacheWriteTokens
    entity.totalTokens = this.totalTokens
    return entity
  }
}
