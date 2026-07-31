import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { SyncPricingModelsResult } from '@/features/admin-channels/domain/models/syncPricingModelsResult'

export class SyncPricingModelsResultDto {
  @Expose()
  @Transform(({ value }) => value ?? [])
  models!: string[]

  static fromJson(json: unknown): SyncPricingModelsResultDto {
    return plainToInstance(SyncPricingModelsResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): SyncPricingModelsResult {
    const entity = new SyncPricingModelsResult()
    entity.models = this.models
    return entity
  }
}
