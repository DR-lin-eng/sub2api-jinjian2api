import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpsDataRetentionSettings } from '@/features/admin-ops/domain/models/opsDataRetentionSettings'

export class OpsDataRetentionSettingsDto {
  @Expose({ name: 'user_request_log_retention_days' }) @Transform(({ value }) => value ?? 0) userRequestLogRetentionDays!: number
  @Expose({ name: 'cleanup_enabled' }) @Transform(({ value }) => value ?? false) cleanupEnabled!: boolean
  @Expose({ name: 'cleanup_schedule' }) @Transform(({ value }) => value ?? '') cleanupSchedule!: string
  @Expose({ name: 'error_log_retention_days' }) @Transform(({ value }) => value ?? 0) errorLogRetentionDays!: number
  @Expose({ name: 'minute_metrics_retention_days' }) @Transform(({ value }) => value ?? 0) minuteMetricsRetentionDays!: number
  @Expose({ name: 'hourly_metrics_retention_days' }) @Transform(({ value }) => value ?? 0) hourlyMetricsRetentionDays!: number

  static fromJson(json: unknown): OpsDataRetentionSettingsDto {
    return plainToInstance(OpsDataRetentionSettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsDataRetentionSettings {
    const e = new OpsDataRetentionSettings()
    e.userRequestLogRetentionDays = this.userRequestLogRetentionDays
    e.cleanupEnabled = this.cleanupEnabled
    e.cleanupSchedule = this.cleanupSchedule
    e.errorLogRetentionDays = this.errorLogRetentionDays
    e.minuteMetricsRetentionDays = this.minuteMetricsRetentionDays
    e.hourlyMetricsRetentionDays = this.hourlyMetricsRetentionDays
    return e
  }
}
