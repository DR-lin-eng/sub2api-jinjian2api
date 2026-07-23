import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ModelsListConfig } from '@/features/admin-groups/domain/models/modelsListConfig'

export class ModelsListConfigDto {
  @Expose()
  @Transform(({ value }) => value ?? false)
  enabled!: boolean

  @Expose()
  @Transform(({ value }) => value ?? [])
  models!: string[]

  static fromJson(json: unknown): ModelsListConfigDto {
    return plainToInstance(ModelsListConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ModelsListConfig {
    const entity = new ModelsListConfig()
    entity.enabled = this.enabled
    entity.models = this.models
    return entity
  }
}
