import type { PlatformDashboardStats } from '@/features/usage/domain/models/platformDashboardStats'

export interface PlatformDashboardStatsDto {
  platform: string
  total_requests: number
  total_tokens: number
  total_actual_cost: number
  today_requests: number
  today_tokens: number
  today_actual_cost: number
}

export function toEntity(dto: PlatformDashboardStatsDto): PlatformDashboardStats {
  return {
    platform: dto.platform ?? '',
    totalRequests: dto.total_requests ?? 0,
    totalTokens: dto.total_tokens ?? 0,
    totalActualCost: dto.total_actual_cost ?? 0,
    todayRequests: dto.today_requests ?? 0,
    todayTokens: dto.today_tokens ?? 0,
    todayActualCost: dto.today_actual_cost ?? 0,
  }
}
