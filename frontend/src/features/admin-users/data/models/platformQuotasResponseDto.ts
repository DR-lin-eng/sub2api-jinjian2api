import type { PlatformQuotasResponse } from '@/features/admin-users/domain/models/adminUsers'

interface PlatformQuotaItemDto {
  platform: string
  window: string
  limit: number
  used: number
  reset_at?: string | null
}

export interface PlatformQuotasResponseDto {
  quotas: PlatformQuotaItemDto[]
}

function toPlatformQuotaItemEntity(dto: PlatformQuotaItemDto) {
  return {
    platform: dto.platform ?? '',
    window: dto.window ?? '',
    limit: dto.limit ?? 0,
    used: dto.used ?? 0,
    resetAt: dto.reset_at,
  }
}

export function toEntity(dto: PlatformQuotasResponseDto): PlatformQuotasResponse {
  return {
    quotas: (dto.quotas ?? []).map(toPlatformQuotaItemEntity),
  }
}
