export interface ResetPlatformQuotaWindowRequest {
  platform: string
  window: 'daily' | 'weekly' | 'monthly'
}
