import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { EmailReportNotificationConfig } from '@/features/admin-ops/domain/models/emailReportNotificationConfig'

export class EmailReportNotificationConfigDto {
  @Expose() @Transform(({ value }) => value ?? false) enabled!: boolean
  @Expose() @Transform(({ value }) => value ?? []) recipients!: string[]
  @Expose({ name: 'daily_summary_enabled' }) @Transform(({ value }) => value ?? false) dailySummaryEnabled!: boolean
  @Expose({ name: 'daily_summary_schedule' }) @Transform(({ value }) => value ?? '') dailySummarySchedule!: string
  @Expose({ name: 'weekly_summary_enabled' }) @Transform(({ value }) => value ?? false) weeklySummaryEnabled!: boolean
  @Expose({ name: 'weekly_summary_schedule' }) @Transform(({ value }) => value ?? '') weeklySummarySchedule!: string
  @Expose({ name: 'error_digest_enabled' }) @Transform(({ value }) => value ?? false) errorDigestEnabled!: boolean
  @Expose({ name: 'error_digest_schedule' }) @Transform(({ value }) => value ?? '') errorDigestSchedule!: string
  @Expose({ name: 'error_digest_min_count' }) @Transform(({ value }) => value ?? 0) errorDigestMinCount!: number
  @Expose({ name: 'account_health_enabled' }) @Transform(({ value }) => value ?? false) accountHealthEnabled!: boolean
  @Expose({ name: 'account_health_schedule' }) @Transform(({ value }) => value ?? '') accountHealthSchedule!: string
  @Expose({ name: 'account_health_error_rate_threshold' }) @Transform(({ value }) => value ?? 0) accountHealthErrorRateThreshold!: number

  static fromJson(json: unknown): EmailReportNotificationConfigDto {
    return plainToInstance(EmailReportNotificationConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): EmailReportNotificationConfig {
    const e = new EmailReportNotificationConfig()
    e.enabled = this.enabled
    e.recipients = this.recipients
    e.dailySummaryEnabled = this.dailySummaryEnabled
    e.dailySummarySchedule = this.dailySummarySchedule
    e.weeklySummaryEnabled = this.weeklySummaryEnabled
    e.weeklySummarySchedule = this.weeklySummarySchedule
    e.errorDigestEnabled = this.errorDigestEnabled
    e.errorDigestSchedule = this.errorDigestSchedule
    e.errorDigestMinCount = this.errorDigestMinCount
    e.accountHealthEnabled = this.accountHealthEnabled
    e.accountHealthSchedule = this.accountHealthSchedule
    e.accountHealthErrorRateThreshold = this.accountHealthErrorRateThreshold
    return e
  }
}
