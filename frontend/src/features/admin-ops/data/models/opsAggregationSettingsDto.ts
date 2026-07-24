import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpsAggregationSettings } from '@/features/admin-ops/domain/models/opsAggregationSettings'

export class OpsAggregationSettingsDto {
  @Expose({ name: 'aggregation_enabled' }) @Transform(({ value }) => value ?? false) aggregationEnabled!: boolean

  static fromJson(json: unknown): OpsAggregationSettingsDto {
    return plainToInstance(OpsAggregationSettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsAggregationSettings {
    const e = new OpsAggregationSettings()
    e.aggregationEnabled = this.aggregationEnabled
    return e
  }
}
