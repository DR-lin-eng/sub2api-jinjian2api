import type { TotpStatus } from '@/features/profile/domain/models/totp'

export interface TotpStatusDto {
  enabled: boolean
  enabled_at: number | null
  feature_enabled: boolean
}

export function toEntity(dto: TotpStatusDto): TotpStatus {
  return {
    enabled: dto.enabled ?? false,
    enabledAt: dto.enabled_at ?? null,
    featureEnabled: dto.feature_enabled ?? false,
  }
}
