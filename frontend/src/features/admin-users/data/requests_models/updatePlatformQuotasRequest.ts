export interface PlatformQuotaUpdateItem {
  platform: string
  daily_limit_usd: number | null
  weekly_limit_usd: number | null
  monthly_limit_usd: number | null
}

export interface UpdatePlatformQuotasRequest {
  quotas: PlatformQuotaUpdateItem[]
}
