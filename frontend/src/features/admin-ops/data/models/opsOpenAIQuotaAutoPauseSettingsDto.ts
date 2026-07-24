import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpsOpenAIQuotaAutoPauseSettings } from '@/features/admin-ops/domain/models/opsOpenAIQuotaAutoPauseSettings'

export class OpsOpenAIQuotaAutoPauseSettingsDto {
  @Expose({ name: 'default_threshold_5h' }) @Transform(({ value }) => value ?? 0) defaultThreshold5h!: number
  @Expose({ name: 'default_threshold_7d' }) @Transform(({ value }) => value ?? 0) defaultThreshold7d!: number

  static fromJson(json: unknown): OpsOpenAIQuotaAutoPauseSettingsDto {
    return plainToInstance(OpsOpenAIQuotaAutoPauseSettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsOpenAIQuotaAutoPauseSettings {
    const e = new OpsOpenAIQuotaAutoPauseSettings()
    e.defaultThreshold5h = this.defaultThreshold5h
    e.defaultThreshold7d = this.defaultThreshold7d
    return e
  }
}
