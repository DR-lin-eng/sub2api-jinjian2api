export type PlatformQuotaPlatform = 'anthropic' | 'openai' | 'gemini' | 'antigravity' | 'grok' | string
export type PlatformQuotaWindow = 'daily' | 'weekly' | 'monthly' | string

export class PlatformQuotaItem {
  platform!: PlatformQuotaPlatform
  dailyLimitUsd!: number
  weeklyLimitUsd!: number
  monthlyLimitUsd!: number
  dailyUsageUsd!: number
  weeklyUsageUsd!: number
  monthlyUsageUsd!: number
  dailyWindowStart!: string
  weeklyWindowStart!: string
  monthlyWindowStart!: string
  dailyWindowResetsAt!: string
  weeklyWindowResetsAt!: string
  monthlyWindowResetsAt!: string
}
