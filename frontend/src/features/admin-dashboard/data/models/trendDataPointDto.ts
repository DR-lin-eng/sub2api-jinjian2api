import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { TrendDataPoint } from '@/features/admin-dashboard/domain/models/trendDataPoint'

export class TrendDataPointDto {
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

  @Expose({ name: 'cache_creation_tokens' })
  @Transform(({ value }) => value ?? 0)
  cacheCreationTokens!: number

  @Expose({ name: 'cache_read_tokens' })
  @Transform(({ value }) => value ?? 0)
  cacheReadTokens!: number

  @Expose({ name: 'total_tokens' })
  @Transform(({ value }) => value ?? 0)
  totalTokens!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  cost!: number

  @Expose({ name: 'actual_cost' })
  @Transform(({ value }) => value ?? 0)
  actualCost!: number

  static fromJson(json: unknown): TrendDataPointDto {
    return plainToInstance(TrendDataPointDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): TrendDataPoint {
    const entity = new TrendDataPoint()
    entity.date = this.date
    entity.requests = this.requests
    entity.inputTokens = this.inputTokens
    entity.outputTokens = this.outputTokens
    entity.cacheCreationTokens = this.cacheCreationTokens
    entity.cacheReadTokens = this.cacheReadTokens
    entity.totalTokens = this.totalTokens
    entity.cost = this.cost
    entity.actualCost = this.actualCost
    return entity
  }
}
