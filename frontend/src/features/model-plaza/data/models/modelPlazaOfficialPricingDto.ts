import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ModelPlazaOfficialPricing } from '@/features/model-plaza/domain/models/modelPlazaOfficialPricing'

export class ModelPlazaOfficialPricingDto {
  @Expose({ name: 'input_price' })
  @Transform(({ value }) => value ?? null)
  inputPrice!: number | null

  @Expose({ name: 'output_price' })
  @Transform(({ value }) => value ?? null)
  outputPrice!: number | null

  @Expose({ name: 'cache_write_price' })
  @Transform(({ value }) => value ?? null)
  cacheWritePrice!: number | null

  @Expose({ name: 'cache_write_1h_price' })
  @Transform(({ value }) => value ?? null)
  cacheWrite1hPrice!: number | null

  @Expose({ name: 'cache_read_price' })
  @Transform(({ value }) => value ?? null)
  cacheReadPrice!: number | null

  static fromJson(json: unknown): ModelPlazaOfficialPricingDto {
    return plainToInstance(ModelPlazaOfficialPricingDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ModelPlazaOfficialPricing {
    const entity = new ModelPlazaOfficialPricing()
    entity.inputPrice = this.inputPrice
    entity.outputPrice = this.outputPrice
    entity.cacheWritePrice = this.cacheWritePrice
    entity.cacheWrite1hPrice = this.cacheWrite1hPrice
    entity.cacheReadPrice = this.cacheReadPrice
    return entity
  }
}
