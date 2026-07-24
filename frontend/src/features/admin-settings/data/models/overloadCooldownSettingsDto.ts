import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OverloadCooldownSettings } from '@/features/admin-settings/domain/models/overloadCooldownSettings'

export class OverloadCooldownSettingsDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose({ name: 'cooldown_minutes' }) @Transform(({ value }) => value ?? 0) cooldownMinutes!: number

  static fromJson(json: unknown): OverloadCooldownSettingsDto {
    return plainToInstance(OverloadCooldownSettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OverloadCooldownSettings {
    const e = new OverloadCooldownSettings()
    e.enabled = this.enabled
    e.cooldownMinutes = this.cooldownMinutes
    return e
  }
}
