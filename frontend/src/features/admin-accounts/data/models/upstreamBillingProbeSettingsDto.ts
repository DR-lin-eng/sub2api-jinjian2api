import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UpstreamBillingProbeSettings } from '@/features/admin-accounts/domain/models/upstreamBillingProbeSettings'

export class UpstreamBillingProbeSettingsDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose({ name: 'interval_minutes' }) @Transform(({ value }) => value ?? 60) intervalMinutes!: number

  static fromJson(json: unknown): UpstreamBillingProbeSettingsDto {
    return plainToInstance(UpstreamBillingProbeSettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UpstreamBillingProbeSettings {
    const e = new UpstreamBillingProbeSettings()
    e.enabled = this.enabled
    e.intervalMinutes = this.intervalMinutes
    return e
  }
}
