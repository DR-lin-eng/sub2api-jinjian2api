import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { RateLimit429CooldownSettings } from '@/features/admin-settings/domain/models/rateLimit429CooldownSettings'

export class RateLimit429CooldownSettingsDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose({ name: 'cooldown_seconds' }) @Transform(({ value }) => value ?? 0) cooldownSeconds!: number

  static fromJson(json: unknown): RateLimit429CooldownSettingsDto {
    return plainToInstance(RateLimit429CooldownSettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): RateLimit429CooldownSettings {
    const e = new RateLimit429CooldownSettings()
    e.enabled = this.enabled
    e.cooldownSeconds = this.cooldownSeconds
    return e
  }
}
