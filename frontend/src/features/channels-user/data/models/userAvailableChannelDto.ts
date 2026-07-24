import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { UserAvailableChannel } from '@/features/channels-user/domain/models/userAvailableChannel'
import { UserChannelPlatformSectionDto } from './userChannelPlatformSectionDto'

export class UserAvailableChannelDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  description!: string

  @Expose()
  @Transform(({ value }) => value ?? [])
  @Type(() => UserChannelPlatformSectionDto)
  platforms!: UserChannelPlatformSectionDto[]

  static fromJson(json: unknown): UserAvailableChannelDto {
    return plainToInstance(UserAvailableChannelDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserAvailableChannel {
    const e = new UserAvailableChannel()
    e.name = this.name
    e.description = this.description
    e.platforms = (this.platforms ?? []).map(p => p.toEntity())
    return e
  }
}
