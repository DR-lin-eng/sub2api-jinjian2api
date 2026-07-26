import type { EndpointStat } from '@/core/models/domain/endpointStat'

export class AdminUsageStatsResponse {
  totalRequests!: number
  totalInputTokens!: number
  totalOutputTokens!: number
  totalCacheTokens!: number
  totalCacheCreationTokens!: number
  totalCacheReadTokens!: number
  totalTokens!: number
  totalCost!: number
  totalActualCost!: number
  totalAccountCost!: number
  averageDurationMs!: number
  models!: Record<string, number>
  endpoints?: EndpointStat[]
  upstreamEndpoints?: EndpointStat[]
  endpointPaths?: EndpointStat[]
}
