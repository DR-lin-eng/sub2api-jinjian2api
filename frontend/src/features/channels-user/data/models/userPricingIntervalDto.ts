import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UserPricingInterval } from '@/features/channels-user/domain/models/userPricingInterval'

export class UserPricingIntervalDto {
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

  static fromJson(json: unknown): UserPricingIntervalDto {
    return plainToInstance(UserPricingIntervalDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserPricingInterval {
    const e = new UserPricingInterval()
    e.minTokens = this.minTokens
    e.maxTokens = this.maxTokens
    e.tierLabel = this.tierLabel
    e.inputPrice = this.inputPrice
    e.outputPrice = this.outputPrice
    e.cacheWritePrice = this.cacheWritePrice
    e.cacheReadPrice = this.cacheReadPrice
    e.perRequestPrice = this.perRequestPrice
    return e
  }
}
