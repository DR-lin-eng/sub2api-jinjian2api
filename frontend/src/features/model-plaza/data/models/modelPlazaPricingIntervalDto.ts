import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ModelPlazaPricingInterval } from '@/features/model-plaza/domain/models/modelPlazaPricingInterval'

export class ModelPlazaPricingIntervalDto {
  @Expose({ name: 'min_tokens' })
  @Transform(({ value }) => value ?? 0)
  minTokens!: number

  @Expose({ name: 'max_tokens' })
  @Transform(({ value }) => value ?? null)
  maxTokens!: number | null

  @Expose({ name: 'tier_label' })
  @Transform(({ value }) => value ?? '')
  tierLabel!: string

  @Expose({ name: 'input_price' })
  @Transform(({ value }) => value ?? null)
  inputPrice!: number | null

  @Expose({ name: 'output_price' })
  @Transform(({ value }) => value ?? null)
  outputPrice!: number | null

  @Expose({ name: 'cache_write_price' })
  @Transform(({ value }) => value ?? null)
  cacheWritePrice!: number | null

  @Expose({ name: 'cache_read_price' })
  @Transform(({ value }) => value ?? null)
  cacheReadPrice!: number | null

  @Expose({ name: 'per_request_price' })
  @Transform(({ value }) => value ?? null)
  perRequestPrice!: number | null

  static fromJson(json: unknown): ModelPlazaPricingIntervalDto {
    return plainToInstance(ModelPlazaPricingIntervalDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ModelPlazaPricingInterval {
    const entity = new ModelPlazaPricingInterval()
    entity.minTokens = this.minTokens
    entity.maxTokens = this.maxTokens
    entity.tierLabel = this.tierLabel
    entity.inputPrice = this.inputPrice
    entity.outputPrice = this.outputPrice
    entity.cacheWritePrice = this.cacheWritePrice
    entity.cacheReadPrice = this.cacheReadPrice
    entity.perRequestPrice = this.perRequestPrice
    return entity
  }
}
