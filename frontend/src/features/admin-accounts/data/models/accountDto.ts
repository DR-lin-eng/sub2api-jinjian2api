import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import type { AccountPlatform } from '@/features/admin-accounts/enums/accountPlatform'
import type { AccountType } from '@/features/admin-accounts/enums/accountType'
import { Account } from '@/features/admin-accounts/domain/models/account'
import { AccountSchedulerScoreDto } from '@/features/admin-accounts/data/models/accountSchedulerScoreDto'
import { AccountSchedulerGroupScoreDto } from '@/features/admin-accounts/data/models/accountSchedulerGroupScoreDto'
import { AccountHourlyUsageStatsDto } from '@/features/admin-accounts/data/models/accountHourlyUsageStatsDto'

export class AccountDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose() @Transform(({ value }) => value ?? '') notes!: string
  @Expose() platform!: AccountPlatform
  @Expose() type!: AccountType
  @Expose() @Transform(({ value }) => value ?? {}) credentials!: Record<string, unknown>
  @Expose({ name: 'credentials_status' }) @Transform(({ value }) => value ?? {}) credentialsStatus!: Record<string, boolean>
  @Expose() @Transform(({ value }) => value ?? {}) extra!: Record<string, unknown>
  @Expose({ name: 'proxy_id' }) @Transform(({ value }) => value ?? 0) proxyId!: number
  @Expose({ name: 'proxy_fallback_origin_id' }) @Transform(({ value }) => value ?? 0) proxyFallbackOriginId!: number
  @Expose({ name: 'proxy_fallback_origin_name' }) @Transform(({ value }) => value ?? '') proxyFallbackOriginName!: string
  @Expose() @Transform(({ value }) => value ?? 1) concurrency!: number
  @Expose({ name: 'load_factor' }) @Transform(({ value }) => value ?? 0) loadFactor!: number
  @Expose({ name: 'current_concurrency' }) @Transform(({ value }) => value ?? 0) currentConcurrency!: number
  @Expose({ name: 'scheduler_score' }) @Type(() => AccountSchedulerScoreDto) schedulerScore?: AccountSchedulerScoreDto
  @Expose({ name: 'scheduler_scores' }) @Type(() => AccountSchedulerGroupScoreDto) @Transform(({ value }) => value ?? [], { toClassOnly: true }) schedulerScores!: AccountSchedulerGroupScoreDto[]
  @Expose() @Transform(({ value }) => value ?? 0) priority!: number
  @Expose({ name: 'rate_multiplier' }) @Transform(({ value }) => value ?? 1) rateMultiplier!: number
  @Expose() @Transform(({ value }) => value ?? 'inactive') status!: 'active' | 'inactive' | 'error'
  @Expose({ name: 'error_message' }) @Transform(({ value }) => value ?? '') errorMessage!: string
  @Expose({ name: 'last_used_at' }) @Transform(({ value }) => value ?? '') lastUsedAt!: string
  @Expose({ name: 'expires_at' }) @Transform(({ value }) => value ?? 0) expiresAt!: number
  @Expose({ name: 'auto_pause_on_expired' }) @Transform(({ value }) => value ?? false) autoPauseOnExpired!: boolean
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string
  @Expose({ name: 'updated_at' }) @Transform(({ value }) => value ?? '') updatedAt!: string
  @Expose({ name: 'group_ids' }) @Transform(({ value }) => value ?? []) groupIds!: number[]
  @Expose() @Transform(({ value }) => value ?? true) schedulable!: boolean
  @Expose({ name: 'rate_limited_at' }) @Transform(({ value }) => value ?? '') rateLimitedAt!: string
  @Expose({ name: 'rate_limit_reset_at' }) @Transform(({ value }) => value ?? '') rateLimitResetAt!: string
  @Expose({ name: 'overload_until' }) @Transform(({ value }) => value ?? '') overloadUntil!: string
  @Expose({ name: 'temp_unschedulable_until' }) @Transform(({ value }) => value ?? '') tempUnschedulableUntil!: string
  @Expose({ name: 'temp_unschedulable_reason' }) @Transform(({ value }) => value ?? '') tempUnschedulableReason!: string
  @Expose({ name: 'session_window_start' }) @Transform(({ value }) => value ?? '') sessionWindowStart!: string
  @Expose({ name: 'session_window_end' }) @Transform(({ value }) => value ?? '') sessionWindowEnd!: string
  @Expose({ name: 'session_window_status' }) @Transform(({ value }) => value ?? '') sessionWindowStatus!: 'allowed' | 'allowed_warning' | 'rejected' | ''
  @Expose({ name: 'window_cost_limit' }) @Transform(({ value }) => value ?? 0) windowCostLimit!: number
  @Expose({ name: 'window_cost_sticky_reserve' }) @Transform(({ value }) => value ?? 0) windowCostStickyReserve!: number
  @Expose({ name: 'max_sessions' }) @Transform(({ value }) => value ?? 0) maxSessions!: number
  @Expose({ name: 'session_idle_timeout_minutes' }) @Transform(({ value }) => value ?? 0) sessionIdleTimeoutMinutes!: number
  @Expose({ name: 'base_rpm' }) @Transform(({ value }) => value ?? 0) baseRpm!: number
  @Expose({ name: 'rpm_strategy' }) @Transform(({ value }) => value ?? '') rpmStrategy!: string
  @Expose({ name: 'rpm_sticky_buffer' }) @Transform(({ value }) => value ?? 0) rpmStickyBuffer!: number
  @Expose({ name: 'user_msg_queue_mode' }) @Transform(({ value }) => value ?? '') userMsgQueueMode!: string
  @Expose({ name: 'enable_tls_fingerprint' }) @Transform(({ value }) => value ?? false) enableTlsFingerprint!: boolean
  @Expose({ name: 'tls_fingerprint_profile_id' }) @Transform(({ value }) => value ?? 0) tlsFingerprintProfileId!: number
  @Expose({ name: 'session_id_masking_enabled' }) @Transform(({ value }) => value ?? false) sessionIdMaskingEnabled!: boolean
  @Expose({ name: 'cache_ttl_override_enabled' }) @Transform(({ value }) => value ?? false) cacheTtlOverrideEnabled!: boolean
  @Expose({ name: 'cache_ttl_override_target' }) @Transform(({ value }) => value ?? '') cacheTtlOverrideTarget!: string
  @Expose({ name: 'custom_base_url_enabled' }) @Transform(({ value }) => value ?? false) customBaseUrlEnabled!: boolean
  @Expose({ name: 'custom_base_url' }) @Transform(({ value }) => value ?? '') customBaseUrl!: string
  @Expose({ name: 'quota_limit' }) @Transform(({ value }) => value ?? 0) quotaLimit!: number
  @Expose({ name: 'quota_used' }) @Transform(({ value }) => value ?? 0) quotaUsed!: number
  @Expose({ name: 'quota_daily_limit' }) @Transform(({ value }) => value ?? 0) quotaDailyLimit!: number
  @Expose({ name: 'quota_daily_used' }) @Transform(({ value }) => value ?? 0) quotaDailyUsed!: number
  @Expose({ name: 'quota_weekly_limit' }) @Transform(({ value }) => value ?? 0) quotaWeeklyLimit!: number
  @Expose({ name: 'quota_weekly_used' }) @Transform(({ value }) => value ?? 0) quotaWeeklyUsed!: number
  @Expose({ name: 'quota_daily_reset_mode' }) @Transform(({ value }) => value ?? '') quotaDailyResetMode!: 'rolling' | 'fixed' | ''
  @Expose({ name: 'quota_daily_reset_hour' }) @Transform(({ value }) => value ?? 0) quotaDailyResetHour!: number
  @Expose({ name: 'quota_weekly_reset_mode' }) @Transform(({ value }) => value ?? '') quotaWeeklyResetMode!: 'rolling' | 'fixed' | ''
  @Expose({ name: 'quota_weekly_reset_day' }) @Transform(({ value }) => value ?? 0) quotaWeeklyResetDay!: number
  @Expose({ name: 'quota_weekly_reset_hour' }) @Transform(({ value }) => value ?? 0) quotaWeeklyResetHour!: number
  @Expose({ name: 'quota_reset_timezone' }) @Transform(({ value }) => value ?? '') quotaResetTimezone!: string
  @Expose({ name: 'quota_daily_reset_at' }) @Transform(({ value }) => value ?? '') quotaDailyResetAt!: string
  @Expose({ name: 'quota_weekly_reset_at' }) @Transform(({ value }) => value ?? '') quotaWeeklyResetAt!: string
  @Expose({ name: 'current_window_cost' }) @Transform(({ value }) => value ?? 0) currentWindowCost!: number
  @Expose({ name: 'active_sessions' }) @Transform(({ value }) => value ?? 0) activeSessions!: number
  @Expose({ name: 'current_rpm' }) @Transform(({ value }) => value ?? 0) currentRpm!: number
  @Expose({ name: 'hourly_usage' }) @Type(() => AccountHourlyUsageStatsDto) hourlyUsage?: AccountHourlyUsageStatsDto
  @Expose({ name: 'parent_account_id' }) @Transform(({ value }) => value ?? 0) parentAccountId!: number
  @Expose({ name: 'quota_dimension' }) @Transform(({ value }) => value ?? '') quotaDimension!: string
  @Expose({ name: 'parent_email' }) @Transform(({ value }) => value ?? '') parentEmail!: string
  @Expose({ name: 'parent_plan_type' }) @Transform(({ value }) => value ?? '') parentPlanType!: string
  @Expose({ name: 'parent_privacy_mode' }) @Transform(({ value }) => value ?? '') parentPrivacyMode!: string
  @Expose({ name: 'parent_subscription_expires_at' }) @Transform(({ value }) => value ?? '') parentSubscriptionExpiresAt!: string
  @Expose({ name: 'parent_chatgpt_account_id' }) @Transform(({ value }) => value ?? '') parentChatgptAccountId!: string

  static fromJson(json: unknown): AccountDto {
    return plainToInstance(AccountDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): Account {
    const e = new Account()
    e.id = this.id
    e.name = this.name
    e.notes = this.notes
    e.platform = this.platform
    e.type = this.type
    e.credentials = this.credentials
    e.credentialsStatus = this.credentialsStatus
    e.extra = this.extra
    e.proxyId = this.proxyId
    e.proxyFallbackOriginId = this.proxyFallbackOriginId
    e.proxyFallbackOriginName = this.proxyFallbackOriginName
    e.concurrency = this.concurrency
    e.loadFactor = this.loadFactor
    e.currentConcurrency = this.currentConcurrency
    e.schedulerScore = this.schedulerScore ? this.schedulerScore.toEntity() : undefined
    e.schedulerScores = (this.schedulerScores ?? []).map(dto => dto.toEntity())
    e.priority = this.priority
    e.rateMultiplier = this.rateMultiplier
    e.status = this.status
    e.errorMessage = this.errorMessage
    e.lastUsedAt = this.lastUsedAt
    e.expiresAt = this.expiresAt
    e.autoPauseOnExpired = this.autoPauseOnExpired
    e.createdAt = this.createdAt
    e.updatedAt = this.updatedAt
    e.groupIds = this.groupIds
    e.schedulable = this.schedulable
    e.rateLimitedAt = this.rateLimitedAt
    e.rateLimitResetAt = this.rateLimitResetAt
    e.overloadUntil = this.overloadUntil
    e.tempUnschedulableUntil = this.tempUnschedulableUntil
    e.tempUnschedulableReason = this.tempUnschedulableReason
    e.sessionWindowStart = this.sessionWindowStart
    e.sessionWindowEnd = this.sessionWindowEnd
    e.sessionWindowStatus = this.sessionWindowStatus
    e.windowCostLimit = this.windowCostLimit
    e.windowCostStickyReserve = this.windowCostStickyReserve
    e.maxSessions = this.maxSessions
    e.sessionIdleTimeoutMinutes = this.sessionIdleTimeoutMinutes
    e.baseRpm = this.baseRpm
    e.rpmStrategy = this.rpmStrategy
    e.rpmStickyBuffer = this.rpmStickyBuffer
    e.userMsgQueueMode = this.userMsgQueueMode
    e.enableTlsFingerprint = this.enableTlsFingerprint
    e.tlsFingerprintProfileId = this.tlsFingerprintProfileId
    e.sessionIdMaskingEnabled = this.sessionIdMaskingEnabled
    e.cacheTtlOverrideEnabled = this.cacheTtlOverrideEnabled
    e.cacheTtlOverrideTarget = this.cacheTtlOverrideTarget
    e.customBaseUrlEnabled = this.customBaseUrlEnabled
    e.customBaseUrl = this.customBaseUrl
    e.quotaLimit = this.quotaLimit
    e.quotaUsed = this.quotaUsed
    e.quotaDailyLimit = this.quotaDailyLimit
    e.quotaDailyUsed = this.quotaDailyUsed
    e.quotaWeeklyLimit = this.quotaWeeklyLimit
    e.quotaWeeklyUsed = this.quotaWeeklyUsed
    e.quotaDailyResetMode = this.quotaDailyResetMode
    e.quotaDailyResetHour = this.quotaDailyResetHour
    e.quotaWeeklyResetMode = this.quotaWeeklyResetMode
    e.quotaWeeklyResetDay = this.quotaWeeklyResetDay
    e.quotaWeeklyResetHour = this.quotaWeeklyResetHour
    e.quotaResetTimezone = this.quotaResetTimezone
    e.quotaDailyResetAt = this.quotaDailyResetAt
    e.quotaWeeklyResetAt = this.quotaWeeklyResetAt
    e.currentWindowCost = this.currentWindowCost
    e.activeSessions = this.activeSessions
    e.currentRpm = this.currentRpm
    e.hourlyUsage = this.hourlyUsage ? this.hourlyUsage.toEntity() : undefined
    e.parentAccountId = this.parentAccountId
    e.quotaDimension = this.quotaDimension
    e.parentEmail = this.parentEmail
    e.parentPlanType = this.parentPlanType
    e.parentPrivacyMode = this.parentPrivacyMode
    e.parentSubscriptionExpiresAt = this.parentSubscriptionExpiresAt
    e.parentChatgptAccountId = this.parentChatgptAccountId
    return e
  }
}
