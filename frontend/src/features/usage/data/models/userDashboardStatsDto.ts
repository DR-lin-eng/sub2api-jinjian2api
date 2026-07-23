import type { UserDashboardStats } from '@/features/usage/domain/models/userDashboardStats'
import type { PlatformDashboardStatsDto } from './platformDashboardStatsDto'
import { toEntity as toPlatformEntity } from './platformDashboardStatsDto'

export interface UserDashboardStatsDto {
  total_api_keys: number
  active_api_keys: number
  total_requests: number
  total_input_tokens: number
  total_output_tokens: number
  total_cache_creation_tokens: number
  total_cache_read_tokens: number
  total_tokens: number
  total_cost: number
  total_actual_cost: number
  today_requests: number
  today_input_tokens: number
  today_output_tokens: number
  today_cache_creation_tokens: number
  today_cache_read_tokens: number
  today_tokens: number
  today_cost: number
  today_actual_cost: number
  average_duration_ms: number
  rpm: number
  tpm: number
  by_platform?: PlatformDashboardStatsDto[]
}

export function toEntity(dto: UserDashboardStatsDto): UserDashboardStats {
  return {
    totalApiKeys: dto.total_api_keys ?? 0,
    activeApiKeys: dto.active_api_keys ?? 0,
    totalRequests: dto.total_requests ?? 0,
    totalInputTokens: dto.total_input_tokens ?? 0,
    totalOutputTokens: dto.total_output_tokens ?? 0,
    totalCacheCreationTokens: dto.total_cache_creation_tokens ?? 0,
    totalCacheReadTokens: dto.total_cache_read_tokens ?? 0,
    totalTokens: dto.total_tokens ?? 0,
    totalCost: dto.total_cost ?? 0,
    totalActualCost: dto.total_actual_cost ?? 0,
    todayRequests: dto.today_requests ?? 0,
    todayInputTokens: dto.today_input_tokens ?? 0,
    todayOutputTokens: dto.today_output_tokens ?? 0,
    todayCacheCreationTokens: dto.today_cache_creation_tokens ?? 0,
    todayCacheReadTokens: dto.today_cache_read_tokens ?? 0,
    todayTokens: dto.today_tokens ?? 0,
    todayCost: dto.today_cost ?? 0,
    todayActualCost: dto.today_actual_cost ?? 0,
    averageDurationMs: dto.average_duration_ms ?? 0,
    rpm: dto.rpm ?? 0,
    tpm: dto.tpm ?? 0,
    byPlatform: dto.by_platform?.map(toPlatformEntity),
  }
}
