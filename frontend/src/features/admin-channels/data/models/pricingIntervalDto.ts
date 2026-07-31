import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PricingInterval } from '@/features/admin-channels/domain/models/pricingInterval'

export class PricingIntervalDto {
  @Expose()
  id?: number

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

  @Expose({ name: 'sort_order' })
  @Transform(({ value }) => value ?? 0)
  sortOrder!: number

  static fromJson(json: unknown): PricingIntervalDto {
    return plainToInstance(PricingIntervalDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PricingInterval {
    const entity = new PricingInterval()
    entity.id = this.id
    entity.minTokens = this.minTokens
    entity.maxTokens = this.maxTokens
    entity.tierLabel = this.tierLabel
    entity.inputPrice = this.inputPrice
    entity.outputPrice = this.outputPrice
    entity.cacheWritePrice = this.cacheWritePrice
    entity.cacheReadPrice = this.cacheReadPrice
    entity.perRequestPrice = this.perRequestPrice
    entity.sortOrder = this.sortOrder
    return entity
  }
}
