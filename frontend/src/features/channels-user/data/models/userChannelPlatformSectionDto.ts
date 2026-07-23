import type { UserChannelPlatformSection } from '@/features/channels-user/domain/models/userChannelPlatformSection'
import type { UserAvailableGroupDto } from './userAvailableGroupDto'
import type { UserSupportedModelDto } from './userSupportedModelDto'
import { toEntity as toGroupEntity } from './userAvailableGroupDto'
import { toEntity as toModelEntity } from './userSupportedModelDto'

export interface UserChannelPlatformSectionDto {
  platform: string
  groups: UserAvailableGroupDto[]
  supported_models: UserSupportedModelDto[]
}

export function toEntity(dto: UserChannelPlatformSectionDto): UserChannelPlatformSection {
  return {
    platform: dto.platform ?? '',
    groups: (dto.groups ?? []).map(toGroupEntity),
    supportedModels: (dto.supported_models ?? []).map(toModelEntity),
  }
}
