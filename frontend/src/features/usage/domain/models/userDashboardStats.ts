export interface UserDashboardStats {
  totalApiKeys: number
  activeApiKeys: number
  totalRequests: number
  totalInputTokens: number
  totalOutputTokens: number
  totalCacheCreationTokens: number
  totalCacheReadTokens: number
  totalTokens: number
  totalCost: number
  totalActualCost: number
  todayRequests: number
  todayInputTokens: number
  todayOutputTokens: number
  todayCacheCreationTokens: number
  todayCacheReadTokens: number
  todayTokens: number
  todayCost: number
  todayActualCost: number
  averageDurationMs: number
  rpm: number
  tpm: number
  byPlatform?: import('./platformDashboardStats').PlatformDashboardStats[]
}
