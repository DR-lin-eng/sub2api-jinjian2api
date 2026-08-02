import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { ModelPlazaModel } from '@/features/model-plaza/domain/models/modelPlazaModel'
import { ModelPlazaOfficialPricingDto } from './modelPlazaOfficialPricingDto'
import { ModelPlazaPricingDto } from './modelPlazaPricingDto'

export class ModelPlazaModelDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  platform!: string

  @Expose()
  @Transform(({ value }) => value ?? null)
  @Type(() => ModelPlazaPricingDto)
  pricing!: ModelPlazaPricingDto | null

  @Expose({ name: 'official_pricing' })
  @Transform(({ value }) => value ?? null)
  @Type(() => ModelPlazaOfficialPricingDto)
  officialPricing!: ModelPlazaOfficialPricingDto | null

  static fromJson(json: unknown): ModelPlazaModelDto {
    return plainToInstance(ModelPlazaModelDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ModelPlazaModel {
    const entity = new ModelPlazaModel()
    entity.name = this.name
    entity.platform = this.platform
    entity.pricing = this.pricing?.toEntity() ?? null
    entity.officialPricing = this.officialPricing?.toEntity() ?? null
    return entity
  }
}
