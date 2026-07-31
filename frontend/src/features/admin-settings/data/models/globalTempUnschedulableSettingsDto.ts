import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { GlobalTempUnschedulableSettings } from '@/features/admin-settings/domain/models/globalTempUnschedulableSettings'

export class GlobalTempUnschedulableSettingsDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean

  static fromJson(json: unknown): GlobalTempUnschedulableSettingsDto {
    return plainToInstance(GlobalTempUnschedulableSettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GlobalTempUnschedulableSettings {
    const e = new GlobalTempUnschedulableSettings()
    e.enabled = this.enabled
    return e
  }
}
