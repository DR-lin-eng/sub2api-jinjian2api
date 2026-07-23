import type { UserAvailableGroup } from '@/features/channels-user/domain/models/userAvailableGroup'

export interface UserAvailableGroupDto {
  id: number
  name: string
  platform: string
  subscription_type: string
  rate_multiplier: number
  peak_rate_enabled: boolean
  peak_start: string
  peak_end: string
  peak_rate_multiplier: number
  is_exclusive: boolean
}

export function toEntity(dto: UserAvailableGroupDto): UserAvailableGroup {
  return {
    id: dto.id ?? 0,
    name: dto.name ?? '',
    platform: dto.platform ?? '',
    subscriptionType: dto.subscription_type ?? '',
    rateMultiplier: dto.rate_multiplier ?? 1,
    peakRateEnabled: dto.peak_rate_enabled ?? false,
    peakStart: dto.peak_start ?? '',
    peakEnd: dto.peak_end ?? '',
    peakRateMultiplier: dto.peak_rate_multiplier ?? 1,
    isExclusive: dto.is_exclusive ?? false,
  }
}
