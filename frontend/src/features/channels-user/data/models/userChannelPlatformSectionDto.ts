import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { UserChannelPlatformSection } from '@/features/channels-user/domain/models/userChannelPlatformSection'
import { UserAvailableGroupDto } from './userAvailableGroupDto'
import { UserSupportedModelDto } from './userSupportedModelDto'

export class UserChannelPlatformSectionDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  platform!: string

  @Expose()
  @Transform(({ value }) => value ?? [])
  @Type(() => UserAvailableGroupDto)
  groups!: UserAvailableGroupDto[]

  @Expose({ name: 'supported_models' })
  @Transform(({ value }) => value ?? [])
  @Type(() => UserSupportedModelDto)
  supportedModels!: UserSupportedModelDto[]

  static fromJson(json: unknown): UserChannelPlatformSectionDto {
    return plainToInstance(UserChannelPlatformSectionDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserChannelPlatformSection {
    const e = new UserChannelPlatformSection()
    e.platform = this.platform
    e.groups = (this.groups ?? []).map(g => g.toEntity())
    e.supportedModels = (this.supportedModels ?? []).map(m => m.toEntity())
    return e
  }
}
