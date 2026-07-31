import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { StreamTimeoutSettings } from '@/features/admin-settings/domain/models/streamTimeoutSettings'

export class StreamTimeoutSettingsDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose() @Transform(({ value }) => value ?? 'none') action!: 'temp_unsched' | 'error' | 'none'
  @Expose({ name: 'temp_unsched_minutes' }) @Transform(({ value }) => value ?? 0) tempUnschedMinutes!: number
  @Expose({ name: 'threshold_count' }) @Transform(({ value }) => value ?? 0) thresholdCount!: number
  @Expose({ name: 'threshold_window_minutes' }) @Transform(({ value }) => value ?? 0) thresholdWindowMinutes!: number

  static fromJson(json: unknown): StreamTimeoutSettingsDto {
    return plainToInstance(StreamTimeoutSettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): StreamTimeoutSettings {
    const e = new StreamTimeoutSettings()
    e.enabled = this.enabled
    e.action = this.action
    e.tempUnschedMinutes = this.tempUnschedMinutes
    e.thresholdCount = this.thresholdCount
    e.thresholdWindowMinutes = this.thresholdWindowMinutes
    return e
  }
}
