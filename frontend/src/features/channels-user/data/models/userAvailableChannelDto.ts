import type { UserAvailableChannel } from '@/features/channels-user/domain/models/userAvailableChannel'
import type { UserChannelPlatformSectionDto } from './userChannelPlatformSectionDto'
import { toEntity as toPlatformEntity } from './userChannelPlatformSectionDto'

export interface UserAvailableChannelDto {
  name: string
  description: string
  platforms: UserChannelPlatformSectionDto[]
}

export function toEntity(dto: UserAvailableChannelDto): UserAvailableChannel {
  return {
    name: dto.name ?? '',
    description: dto.description ?? '',
    platforms: (dto.platforms ?? []).map(toPlatformEntity),
  }
}
