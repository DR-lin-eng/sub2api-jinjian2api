import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import type { BillingMode } from '@/core/constants/channel'
import { ChannelModelPricing } from '@/features/admin-channels/domain/models/channelModelPricing'
import { PricingIntervalDto } from '@/features/admin-channels/data/models/pricingIntervalDto'

export class ChannelModelPricingDto {
  @Expose()
  id?: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  platform!: string

  @Expose()
  @Transform(({ value }) => value ?? [])
  models!: string[]

  @Expose({ name: 'billing_mode' })
  billingMode!: BillingMode

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

  @Expose({ name: 'image_input_price' })
  @Transform(({ value }) => value ?? null)
  imageInputPrice!: number | null

  @Expose({ name: 'image_output_price' })
  @Transform(({ value }) => value ?? null)
  imageOutputPrice!: number | null

  @Expose({ name: 'per_request_price' })
  @Transform(({ value }) => value ?? null)
  perRequestPrice!: number | null

  @Expose()
  @Transform(({ value }) => value ?? [])
  @Type(() => PricingIntervalDto)
  intervals!: PricingIntervalDto[]

  static fromJson(json: unknown): ChannelModelPricingDto {
    return plainToInstance(ChannelModelPricingDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ChannelModelPricing {
    const entity = new ChannelModelPricing()
    entity.id = this.id
    entity.platform = this.platform
    entity.models = this.models
    entity.billingMode = this.billingMode
    entity.inputPrice = this.inputPrice
    entity.outputPrice = this.outputPrice
    entity.cacheWritePrice = this.cacheWritePrice
    entity.cacheReadPrice = this.cacheReadPrice
    entity.imageInputPrice = this.imageInputPrice
    entity.imageOutputPrice = this.imageOutputPrice
    entity.perRequestPrice = this.perRequestPrice
    entity.intervals = this.intervals.map(iv => iv.toEntity())
    return entity
  }
}
