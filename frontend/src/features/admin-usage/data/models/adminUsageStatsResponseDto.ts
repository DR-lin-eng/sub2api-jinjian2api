import type { AdminUsageStatsResponse, EndpointStat } from '@/features/admin-usage/domain/models/adminUsage'

export interface AdminUsageStatsResponseDto {
  total_requests: number
  total_input_tokens: number
  total_output_tokens: number
  total_cache_tokens: number
  total_cache_creation_tokens: number
  total_cache_read_tokens: number
  total_tokens: number
  total_cost: number
  total_actual_cost: number
  total_account_cost: number
  average_duration_ms: number
  endpoints?: EndpointStat[]
  upstream_endpoints?: EndpointStat[]
  endpoint_paths?: EndpointStat[]
}

export function toEntity(dto: AdminUsageStatsResponseDto): AdminUsageStatsResponse {
  return {
    totalRequests: dto.total_requests ?? 0,
    totalInputTokens: dto.total_input_tokens ?? 0,
    totalOutputTokens: dto.total_output_tokens ?? 0,
    totalCacheTokens: dto.total_cache_tokens ?? 0,
    totalCacheCreationTokens: dto.total_cache_creation_tokens ?? 0,
    totalCacheReadTokens: dto.total_cache_read_tokens ?? 0,
    totalTokens: dto.total_tokens ?? 0,
    totalCost: dto.total_cost ?? 0,
    totalActualCost: dto.total_actual_cost ?? 0,
    totalAccountCost: dto.total_account_cost ?? 0,
    averageDurationMs: dto.average_duration_ms ?? 0,
    endpoints: dto.endpoints,
    upstreamEndpoints: dto.upstream_endpoints,
    endpointPaths: dto.endpoint_paths,
  }
}
