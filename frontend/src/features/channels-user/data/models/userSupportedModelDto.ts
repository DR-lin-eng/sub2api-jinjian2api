import type { UserSupportedModel } from '@/features/channels-user/domain/models/userSupportedModel'
import type { UserSupportedModelPricingDto } from './userSupportedModelPricingDto'
import { toEntity as toPricingEntity } from './userSupportedModelPricingDto'

export interface UserSupportedModelDto {
  name: string
  platform: string
  pricing: UserSupportedModelPricingDto | null
}

export function toEntity(dto: UserSupportedModelDto): UserSupportedModel {
  return {
    name: dto.name ?? '',
    platform: dto.platform ?? '',
    pricing: dto.pricing ? toPricingEntity(dto.pricing) : null,
  }
}
