import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { ModelPlazaPricing } from '@/features/model-plaza/domain/models/modelPlazaPricing'
import { ModelPlazaPricingIntervalDto } from './modelPlazaPricingIntervalDto'

export class ModelPlazaPricingDto {
  @Expose({ name: 'billing_mode' })
  @Transform(({ value }) => value ?? 'token')
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
  @Type(() => ModelPlazaPricingIntervalDto)
  intervals!: ModelPlazaPricingIntervalDto[]

  static fromJson(json: unknown): ModelPlazaPricingDto {
    return plainToInstance(ModelPlazaPricingDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ModelPlazaPricing {
    const entity = new ModelPlazaPricing()
    entity.billingMode = this.billingMode
    entity.inputPrice = this.inputPrice
    entity.outputPrice = this.outputPrice
    entity.cacheWritePrice = this.cacheWritePrice
    entity.cacheReadPrice = this.cacheReadPrice
    entity.imageInputPrice = this.imageInputPrice
    entity.imageOutputPrice = this.imageOutputPrice
    entity.perRequestPrice = this.perRequestPrice
    entity.intervals = (this.intervals ?? []).map(interval => interval.toEntity())
    return entity
  }
}
