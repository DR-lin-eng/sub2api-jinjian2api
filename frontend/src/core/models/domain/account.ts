import type { AccountPlatform } from '@/core/enums/accountPlatform'
import type { AccountType } from '@/core/enums/accountType'
import { AccountSchedulerScore } from '@/core/models/domain/accountSchedulerScore'
import { AccountSchedulerGroupScore } from '@/core/models/domain/accountSchedulerGroupScore'
import { AccountHourlyUsageStats } from '@/core/models/domain/accountHourlyUsageStats'

export class Account {
  id!: number
  name!: string
  notes!: string
  platform!: AccountPlatform
  type!: AccountType
  credentials!: Record<string, unknown>
  credentialsStatus!: Record<string, boolean>
  extra!: Record<string, unknown>

  proxyId!: number
  proxyFallbackOriginId!: number
  proxyFallbackOriginName!: string
  concurrency!: number
  loadFactor!: number
  currentConcurrency!: number
  schedulerScore?: AccountSchedulerScore
  schedulerScores!: AccountSchedulerGroupScore[]
  priority!: number
  rateMultiplier!: number
  status!: 'active' | 'inactive' | 'error'
  errorMessage!: string
  lastUsedAt!: string
  expiresAt!: number
  autoPauseOnExpired!: boolean
  createdAt!: string
  updatedAt!: string
  groupIds!: number[]

  schedulable!: boolean
  rateLimitedAt!: string
  rateLimitResetAt!: string
  overloadUntil!: string
  tempUnschedulableUntil!: string
  tempUnschedulableReason!: string

  sessionWindowStart!: string
  sessionWindowEnd!: string
  sessionWindowStatus!: 'allowed' | 'allowed_warning' | 'rejected' | ''

  windowCostLimit!: number
  windowCostStickyReserve!: number
  maxSessions!: number
  sessionIdleTimeoutMinutes!: number
  baseRpm!: number
  rpmStrategy!: string
  rpmStickyBuffer!: number
  userMsgQueueMode!: string

  enableTlsFingerprint!: boolean
  tlsFingerprintProfileId!: number
  sessionIdMaskingEnabled!: boolean
  cacheTtlOverrideEnabled!: boolean
  cacheTtlOverrideTarget!: string
  customBaseUrlEnabled!: boolean
  customBaseUrl!: string

  quotaLimit!: number
  quotaUsed!: number
  quotaDailyLimit!: number
  quotaDailyUsed!: number
  quotaWeeklyLimit!: number
  quotaWeeklyUsed!: number
  quotaDailyResetMode!: 'rolling' | 'fixed' | ''
  quotaDailyResetHour!: number
  quotaWeeklyResetMode!: 'rolling' | 'fixed' | ''
  quotaWeeklyResetDay!: number
  quotaWeeklyResetHour!: number
  quotaResetTimezone!: string
  quotaDailyResetAt!: string
  quotaWeeklyResetAt!: string

  currentWindowCost!: number
  activeSessions!: number
  currentRpm!: number
  hourlyUsage?: AccountHourlyUsageStats

  parentAccountId!: number
  quotaDimension!: string
  parentEmail!: string
  parentPlanType!: string
  parentPrivacyMode!: string
  parentSubscriptionExpiresAt!: string
  parentChatgptAccountId!: string
}
