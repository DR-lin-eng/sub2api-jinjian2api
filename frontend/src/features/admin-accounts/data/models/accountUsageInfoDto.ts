import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import type { GrokBillingSummary } from '@/features/admin-accounts/domain/models/grokBillingSummary'
import { GrokQuotaWindowDto } from '@/features/admin-accounts/data/models/grokQuotaWindowDto'
import { AccountUsageInfo } from '@/features/admin-accounts/domain/models/accountUsageInfo'
import { AccountAiCreditDto } from '@/features/admin-accounts/data/models/accountAiCreditDto'
import { UsageProgressDto } from '@/features/admin-accounts/data/models/usageProgressDto'
import { AntigravityModelQuotaDto } from '@/features/admin-accounts/data/models/antigravityModelQuotaDto'
import { WindowStatsDto } from '@/features/admin-accounts/data/models/windowStatsDto'

export class AccountUsageInfoDto {
  @Expose() @Transform(({ value }) => value ?? '') source!: 'passive' | 'active' | ''
  @Expose({ name: 'updated_at' }) @Transform(({ value }) => value ?? '') updatedAt!: string
  @Expose({ name: 'five_hour' }) @Type(() => UsageProgressDto) fiveHour?: UsageProgressDto
  @Expose({ name: 'seven_day' }) @Type(() => UsageProgressDto) sevenDay?: UsageProgressDto
  @Expose({ name: 'seven_day_sonnet' }) @Type(() => UsageProgressDto) sevenDaySonnet?: UsageProgressDto
  @Expose({ name: 'seven_day_fable' }) @Type(() => UsageProgressDto) sevenDayFable?: UsageProgressDto
  @Expose({ name: 'gemini_shared_daily' }) @Type(() => UsageProgressDto) geminiSharedDaily?: UsageProgressDto
  @Expose({ name: 'gemini_pro_daily' }) @Type(() => UsageProgressDto) geminiProDaily?: UsageProgressDto
  @Expose({ name: 'gemini_flash_daily' }) @Type(() => UsageProgressDto) geminiFlashDaily?: UsageProgressDto
  @Expose({ name: 'gemini_shared_minute' }) @Type(() => UsageProgressDto) geminiSharedMinute?: UsageProgressDto
  @Expose({ name: 'gemini_pro_minute' }) @Type(() => UsageProgressDto) geminiProMinute?: UsageProgressDto
  @Expose({ name: 'gemini_flash_minute' }) @Type(() => UsageProgressDto) geminiFlashMinute?: UsageProgressDto
  @Expose({ name: 'antigravity_quota' })
  @Transform(({ value }: { value: Record<string, unknown> | null | undefined }) => {
    if (!value) return {}
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, AntigravityModelQuotaDto.fromJson(v)]))
  })
  antigravityQuota!: Record<string, AntigravityModelQuotaDto>
  @Expose({ name: 'grok_request_quota' }) @Type(() => GrokQuotaWindowDto) grokRequestQuota?: GrokQuotaWindowDto
  @Expose({ name: 'grok_token_quota' }) @Type(() => GrokQuotaWindowDto) grokTokenQuota?: GrokQuotaWindowDto
  @Expose({ name: 'grok_retry_after_seconds' }) @Transform(({ value }) => value ?? 0) grokRetryAfterSeconds!: number
  @Expose({ name: 'grok_entitlement_status' }) @Transform(({ value }) => value ?? '') grokEntitlementStatus!: string
  @Expose({ name: 'grok_quota_snapshot_state' }) @Transform(({ value }) => value ?? '') grokQuotaSnapshotState!: string
  @Expose({ name: 'grok_last_quota_probe_at' }) @Transform(({ value }) => value ?? '') grokLastQuotaProbeAt!: string
  @Expose({ name: 'grok_last_headers_seen_at' }) @Transform(({ value }) => value ?? '') grokLastHeadersSeenAt!: string
  @Expose({ name: 'grok_last_status_code' }) @Transform(({ value }) => value ?? 0) grokLastStatusCode!: number
  @Expose({ name: 'grok_free_token_limit' }) @Transform(({ value }) => value ?? 0) grokFreeTokenLimit!: number
  @Expose({ name: 'grok_local_usage' }) @Type(() => WindowStatsDto) grokLocalUsage?: WindowStatsDto
  @Expose({ name: 'grok_local_usage_24h' }) @Type(() => WindowStatsDto) grokLocalUsage24h?: WindowStatsDto
  @Expose({ name: 'grok_local_usage_7d' }) @Type(() => WindowStatsDto) grokLocalUsage7d?: WindowStatsDto
  @Expose({ name: 'grok_local_usage_monthly' }) @Type(() => WindowStatsDto) grokLocalUsageMonthly?: WindowStatsDto
  @Expose({ name: 'grok_billing' }) grokBilling?: GrokBillingSummary
  @Expose({ name: 'subscription_tier' }) @Transform(({ value }) => value ?? '') subscriptionTier!: string
  @Expose({ name: 'subscription_tier_raw' }) @Transform(({ value }) => value ?? '') subscriptionTierRaw!: string
  @Expose({ name: 'ai_credits' }) @Type(() => AccountAiCreditDto) @Transform(({ value }) => value ?? [], { toClassOnly: true }) aiCredits!: AccountAiCreditDto[]
  @Expose({ name: 'is_forbidden' }) @Transform(({ value }) => value ?? false) isForbidden!: boolean
  @Expose({ name: 'forbidden_reason' }) @Transform(({ value }) => value ?? '') forbiddenReason!: string
  @Expose({ name: 'forbidden_type' }) @Transform(({ value }) => value ?? '') forbiddenType!: string
  @Expose({ name: 'validation_url' }) @Transform(({ value }) => value ?? '') validationUrl!: string
  @Expose({ name: 'needs_verify' }) @Transform(({ value }) => value ?? false) needsVerify!: boolean
  @Expose({ name: 'is_banned' }) @Transform(({ value }) => value ?? false) isBanned!: boolean
  @Expose({ name: 'needs_reauth' }) @Transform(({ value }) => value ?? false) needsReauth!: boolean
  @Expose({ name: 'error_code' }) @Transform(({ value }) => value ?? '') errorCode!: string
  @Expose() @Transform(({ value }) => value ?? '') error!: string

  static fromJson(json: unknown): AccountUsageInfoDto {
    return plainToInstance(AccountUsageInfoDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AccountUsageInfo {
    const e = new AccountUsageInfo()
    e.source = this.source
    e.updatedAt = this.updatedAt
    e.fiveHour = this.fiveHour ? this.fiveHour.toEntity() : undefined
    e.sevenDay = this.sevenDay ? this.sevenDay.toEntity() : undefined
    e.sevenDaySonnet = this.sevenDaySonnet ? this.sevenDaySonnet.toEntity() : undefined
    e.sevenDayFable = this.sevenDayFable ? this.sevenDayFable.toEntity() : undefined
    e.geminiSharedDaily = this.geminiSharedDaily ? this.geminiSharedDaily.toEntity() : undefined
    e.geminiProDaily = this.geminiProDaily ? this.geminiProDaily.toEntity() : undefined
    e.geminiFlashDaily = this.geminiFlashDaily ? this.geminiFlashDaily.toEntity() : undefined
    e.geminiSharedMinute = this.geminiSharedMinute ? this.geminiSharedMinute.toEntity() : undefined
    e.geminiProMinute = this.geminiProMinute ? this.geminiProMinute.toEntity() : undefined
    e.geminiFlashMinute = this.geminiFlashMinute ? this.geminiFlashMinute.toEntity() : undefined
    e.antigravityQuota = Object.fromEntries(Object.entries(this.antigravityQuota ?? {}).map(([k, dto]) => [k, dto.toEntity()]))
    e.grokRequestQuota = this.grokRequestQuota ? this.grokRequestQuota.toEntity() : undefined
    e.grokTokenQuota = this.grokTokenQuota ? this.grokTokenQuota.toEntity() : undefined
    e.grokRetryAfterSeconds = this.grokRetryAfterSeconds
    e.grokEntitlementStatus = this.grokEntitlementStatus
    e.grokQuotaSnapshotState = this.grokQuotaSnapshotState
    e.grokLastQuotaProbeAt = this.grokLastQuotaProbeAt
    e.grokLastHeadersSeenAt = this.grokLastHeadersSeenAt
    e.grokLastStatusCode = this.grokLastStatusCode
    e.grokFreeTokenLimit = this.grokFreeTokenLimit
    e.grokLocalUsage = this.grokLocalUsage ? this.grokLocalUsage.toEntity() : undefined
    e.grokLocalUsage24h = this.grokLocalUsage24h ? this.grokLocalUsage24h.toEntity() : undefined
    e.grokLocalUsage7d = this.grokLocalUsage7d ? this.grokLocalUsage7d.toEntity() : undefined
    e.grokLocalUsageMonthly = this.grokLocalUsageMonthly ? this.grokLocalUsageMonthly.toEntity() : undefined
    e.grokBilling = this.grokBilling
    e.subscriptionTier = this.subscriptionTier
    e.subscriptionTierRaw = this.subscriptionTierRaw
    e.aiCredits = (this.aiCredits ?? []).map(dto => dto.toEntity())
    e.isForbidden = this.isForbidden
    e.forbiddenReason = this.forbiddenReason
    e.forbiddenType = this.forbiddenType
    e.validationUrl = this.validationUrl
    e.needsVerify = this.needsVerify
    e.isBanned = this.isBanned
    e.needsReauth = this.needsReauth
    e.errorCode = this.errorCode
    e.error = this.error
    return e
  }
}
