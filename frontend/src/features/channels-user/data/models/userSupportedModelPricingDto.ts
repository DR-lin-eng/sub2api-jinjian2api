import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { UserSupportedModelPricing } from '@/features/channels-user/domain/models/userSupportedModelPricing'
import { UserPricingIntervalDto } from './userPricingIntervalDto'

export class UserSupportedModelPricingDto {
  @Expose({ name: 'billing_mode' })
  @Transform(({ value }) => value ?? '')
  billingMode!: string

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
  @Type(() => UserPricingIntervalDto)
  intervals!: UserPricingIntervalDto[]

  static fromJson(json: unknown): UserSupportedModelPricingDto {
    return plainToInstance(UserSupportedModelPricingDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserSupportedModelPricing {
    const e = new UserSupportedModelPricing()
    e.billingMode = this.billingMode
    e.inputPrice = this.inputPrice
    e.outputPrice = this.outputPrice
    e.cacheWritePrice = this.cacheWritePrice
    e.cacheReadPrice = this.cacheReadPrice
    e.imageInputPrice = this.imageInputPrice
    e.imageOutputPrice = this.imageOutputPrice
    e.perRequestPrice = this.perRequestPrice
    e.intervals = (this.intervals ?? []).map(iv => iv.toEntity())
    return e
  }
}
