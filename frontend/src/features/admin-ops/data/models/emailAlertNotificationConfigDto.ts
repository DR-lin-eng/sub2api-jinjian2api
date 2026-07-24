import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { EmailAlertNotificationConfig } from '@/features/admin-ops/domain/models/emailAlertNotificationConfig'

export class EmailAlertNotificationConfigDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose() @Transform(({ value }) => value ?? []) recipients!: string[]
  @Expose({ name: 'min_severity' }) @Transform(({ value }) => value ?? '') minSeverity!: string
  @Expose({ name: 'rate_limit_per_hour' }) @Transform(({ value }) => value ?? 0) rateLimitPerHour!: number
  @Expose({ name: 'batching_window_seconds' }) @Transform(({ value }) => value ?? 0) batchingWindowSeconds!: number
  @Expose({ name: 'include_resolved_alerts' }) @Transform(({ value }) => value ?? false) includeResolvedAlerts!: boolean

  static fromJson(json: unknown): EmailAlertNotificationConfigDto {
    return plainToInstance(EmailAlertNotificationConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): EmailAlertNotificationConfig {
    const e = new EmailAlertNotificationConfig()
    e.enabled = this.enabled
    e.recipients = this.recipients
    e.minSeverity = this.minSeverity
    e.rateLimitPerHour = this.rateLimitPerHour
    e.batchingWindowSeconds = this.batchingWindowSeconds
    e.includeResolvedAlerts = this.includeResolvedAlerts
    return e
  }
}
