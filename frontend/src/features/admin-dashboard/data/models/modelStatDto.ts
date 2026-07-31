import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ModelStat } from '@/features/admin-dashboard/domain/models/modelStat'

export class ModelStatDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  model!: string

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

  @Expose({ name: 'account_cost' })
  accountCost?: number

  static fromJson(json: unknown): ModelStatDto {
    return plainToInstance(ModelStatDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ModelStat {
    const entity = new ModelStat()
    entity.model = this.model
    entity.requests = this.requests
    entity.inputTokens = this.inputTokens
    entity.outputTokens = this.outputTokens
    entity.cacheCreationTokens = this.cacheCreationTokens
    entity.cacheReadTokens = this.cacheReadTokens
    entity.totalTokens = this.totalTokens
    entity.cost = this.cost
    entity.actualCost = this.actualCost
    entity.accountCost = this.accountCost
    return entity
  }
}
