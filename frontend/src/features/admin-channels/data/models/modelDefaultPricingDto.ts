import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ModelDefaultPricing } from '@/features/admin-channels/domain/models/modelDefaultPricing'

export class ModelDefaultPricingDto {
  @Expose()
  @Transform(({ value }) => value ?? false)
  found!: boolean

  @Expose({ name: 'input_price' })
  inputPrice?: number

  @Expose({ name: 'output_price' })
  outputPrice?: number

  @Expose({ name: 'cache_write_price' })
  cacheWritePrice?: number

  @Expose({ name: 'cache_read_price' })
  cacheReadPrice?: number

  @Expose({ name: 'image_input_price' })
  imageInputPrice?: number

  @Expose({ name: 'image_output_price' })
  imageOutputPrice?: number

  static fromJson(json: unknown): ModelDefaultPricingDto {
    return plainToInstance(ModelDefaultPricingDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ModelDefaultPricing {
    const entity = new ModelDefaultPricing()
    entity.found = this.found
    entity.inputPrice = this.inputPrice
    entity.outputPrice = this.outputPrice
    entity.cacheWritePrice = this.cacheWritePrice
    entity.cacheReadPrice = this.cacheReadPrice
    entity.imageInputPrice = this.imageInputPrice
    entity.imageOutputPrice = this.imageOutputPrice
    return entity
  }
}
