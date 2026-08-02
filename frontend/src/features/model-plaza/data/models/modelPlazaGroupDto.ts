import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { ModelPlazaGroup } from '@/features/model-plaza/domain/models/modelPlazaGroup'
import { ModelPlazaModelDto } from './modelPlazaModelDto'

export class ModelPlazaGroupDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  description!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  platform!: string

  @Expose({ name: 'subscription_type' })
  @Transform(({ value }) => value ?? 'standard')
  subscriptionType!: string

  @Expose({ name: 'rate_multiplier' })
  @Transform(({ value }) => value ?? 1)
  rateMultiplier!: number

  @Expose({ name: 'user_rate_multiplier' })
  userRateMultiplier?: number

  @Expose({ name: 'peak_rate_enabled' })
  @Transform(({ value }) => value ?? false)
  peakRateEnabled!: boolean

  @Expose({ name: 'peak_start' })
  @Transform(({ value }) => value ?? '')
  peakStart!: string

  @Expose({ name: 'peak_end' })
  @Transform(({ value }) => value ?? '')
  peakEnd!: string

  @Expose({ name: 'peak_rate_multiplier' })
  @Transform(({ value }) => value ?? 1)
  peakRateMultiplier!: number

  @Expose({ name: 'is_exclusive' })
  @Transform(({ value }) => value ?? false)
  isExclusive!: boolean

  @Expose()
  @Transform(({ value }) => value ?? [])
  @Type(() => ModelPlazaModelDto)
  models!: ModelPlazaModelDto[]

  static fromJson(json: unknown): ModelPlazaGroupDto {
    return plainToInstance(ModelPlazaGroupDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ModelPlazaGroup {
    const entity = new ModelPlazaGroup()
    entity.id = this.id
    entity.name = this.name
    entity.description = this.description
    entity.platform = this.platform
    entity.subscriptionType = this.subscriptionType
    entity.rateMultiplier = this.rateMultiplier
    entity.userRateMultiplier = this.userRateMultiplier
    entity.peakRateEnabled = this.peakRateEnabled
    entity.peakStart = this.peakStart
    entity.peakEnd = this.peakEnd
    entity.peakRateMultiplier = this.peakRateMultiplier
    entity.isExclusive = this.isExclusive
    entity.models = (this.models ?? []).map(model => model.toEntity())
    return entity
  }
}
