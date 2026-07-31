import type { EndpointStat } from '@/core/models/domain/endpointStat'

export class UsageStatsResponse {
  period!: string
  totalRequests!: number
  totalInputTokens!: number
  totalOutputTokens!: number
  totalCacheTokens!: number
  totalCacheReadTokens!: number
  totalCacheCreationTokens!: number
  totalTokens!: number
  totalCost!: number
  totalActualCost!: number
  averageDurationMs!: number
  models!: Record<string, number>
  endpoints?: EndpointStat[]
  upstreamEndpoints?: EndpointStat[]
  endpointPaths?: EndpointStat[]
}
