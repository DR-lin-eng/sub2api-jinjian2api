import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpsAdvancedSettings } from '@/features/admin-ops/domain/models/opsAdvancedSettings'
import { OpsDataRetentionSettings } from '@/features/admin-ops/domain/models/opsDataRetentionSettings'
import { OpsAggregationSettings } from '@/features/admin-ops/domain/models/opsAggregationSettings'
import { OpsOpenAIQuotaAutoPauseSettings } from '@/features/admin-ops/domain/models/opsOpenAIQuotaAutoPauseSettings'
import { OpsDataRetentionSettingsDto } from './opsDataRetentionSettingsDto'
import { OpsAggregationSettingsDto } from './opsAggregationSettingsDto'
import { OpsOpenAIQuotaAutoPauseSettingsDto } from './opsOpenAIQuotaAutoPauseSettingsDto'

export class OpsAdvancedSettingsDto {
  @Expose({ name: 'data_retention' }) @Type(() => OpsDataRetentionSettingsDto) dataRetention!: OpsDataRetentionSettingsDto
  @Expose() @Type(() => OpsAggregationSettingsDto) aggregation!: OpsAggregationSettingsDto
  @Expose({ name: 'openai_account_quota_auto_pause' }) @Type(() => OpsOpenAIQuotaAutoPauseSettingsDto) openaiAccountQuotaAutoPause!: OpsOpenAIQuotaAutoPauseSettingsDto
  @Expose({ name: 'ignore_count_tokens_errors' }) @Transform(({ value }) => value ?? false) ignoreCountTokensErrors!: boolean
  @Expose({ name: 'ignore_context_canceled' }) @Transform(({ value }) => value ?? false) ignoreContextCanceled!: boolean
  @Expose({ name: 'ignore_no_available_accounts' }) @Transform(({ value }) => value ?? false) ignoreNoAvailableAccounts!: boolean
  @Expose({ name: 'ignore_invalid_api_key_errors' }) @Transform(({ value }) => value ?? false) ignoreInvalidApiKeyErrors!: boolean
  @Expose({ name: 'ignore_insufficient_balance_errors' }) @Transform(({ value }) => value ?? false) ignoreInsufficientBalanceErrors!: boolean
  @Expose({ name: 'display_openai_token_stats' }) @Transform(({ value }) => value ?? false) displayOpenaiTokenStats!: boolean
  @Expose({ name: 'display_user_usage_stats' }) @Transform(({ value }) => value ?? false) displayUserUsageStats!: boolean
  @Expose({ name: 'display_alert_events' }) @Transform(({ value }) => value ?? false) displayAlertEvents!: boolean
  @Expose({ name: 'display_system_logs' }) @Transform(({ value }) => value ?? false) displaySystemLogs!: boolean
  @Expose({ name: 'display_concurrency' }) @Transform(({ value }) => value ?? false) displayConcurrency!: boolean
  @Expose({ name: 'display_switch_rate_trend' }) @Transform(({ value }) => value ?? false) displaySwitchRateTrend!: boolean
  @Expose({ name: 'display_throughput_trend' }) @Transform(({ value }) => value ?? false) displayThroughputTrend!: boolean
  @Expose({ name: 'display_latency_histogram' }) @Transform(({ value }) => value ?? false) displayLatencyHistogram!: boolean
  @Expose({ name: 'display_error_distribution' }) @Transform(({ value }) => value ?? false) displayErrorDistribution!: boolean
  @Expose({ name: 'display_error_trend' }) @Transform(({ value }) => value ?? false) displayErrorTrend!: boolean
  @Expose({ name: 'display_image_generation_stats' }) @Transform(({ value }) => value ?? false) displayImageGenerationStats!: boolean
  @Expose({ name: 'auto_refresh_enabled' }) @Transform(({ value }) => value ?? false) autoRefreshEnabled!: boolean
  @Expose({ name: 'auto_refresh_interval_seconds' }) @Transform(({ value }) => value ?? 30) autoRefreshIntervalSeconds!: number

  static fromJson(json: unknown): OpsAdvancedSettingsDto {
    return plainToInstance(OpsAdvancedSettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsAdvancedSettings {
    const e = new OpsAdvancedSettings()

    const dr = new OpsDataRetentionSettings()
    dr.userRequestLogRetentionDays = 0; dr.cleanupEnabled = false; dr.cleanupSchedule = ''
    dr.errorLogRetentionDays = 0; dr.minuteMetricsRetentionDays = 0; dr.hourlyMetricsRetentionDays = 0
    e.dataRetention = this.dataRetention ? this.dataRetention.toEntity() : dr

    const agg = new OpsAggregationSettings()
    agg.aggregationEnabled = false
    e.aggregation = this.aggregation ? this.aggregation.toEntity() : agg

    const qap = new OpsOpenAIQuotaAutoPauseSettings()
    qap.defaultThreshold5h = 0; qap.defaultThreshold7d = 0
    e.openaiAccountQuotaAutoPause = this.openaiAccountQuotaAutoPause ? this.openaiAccountQuotaAutoPause.toEntity() : qap

    e.ignoreCountTokensErrors = this.ignoreCountTokensErrors
    e.ignoreContextCanceled = this.ignoreContextCanceled
    e.ignoreNoAvailableAccounts = this.ignoreNoAvailableAccounts
    e.ignoreInvalidApiKeyErrors = this.ignoreInvalidApiKeyErrors
    e.ignoreInsufficientBalanceErrors = this.ignoreInsufficientBalanceErrors
    e.displayOpenaiTokenStats = this.displayOpenaiTokenStats
    e.displayUserUsageStats = this.displayUserUsageStats
    e.displayAlertEvents = this.displayAlertEvents
    e.displaySystemLogs = this.displaySystemLogs
    e.displayConcurrency = this.displayConcurrency
    e.displaySwitchRateTrend = this.displaySwitchRateTrend
    e.displayThroughputTrend = this.displayThroughputTrend
    e.displayLatencyHistogram = this.displayLatencyHistogram
    e.displayErrorDistribution = this.displayErrorDistribution
    e.displayErrorTrend = this.displayErrorTrend
    e.displayImageGenerationStats = this.displayImageGenerationStats
    e.autoRefreshEnabled = this.autoRefreshEnabled
    e.autoRefreshIntervalSeconds = this.autoRefreshIntervalSeconds
    return e
  }
}
