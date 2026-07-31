import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AdminBoundAuthIdentityChannel } from '@/features/admin-users/domain/models/adminBoundAuthIdentityChannel'

export class AdminBoundAuthIdentityChannelDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  channel!: string

  @Expose({ name: 'channel_app_id' })
  @Transform(({ value }) => value ?? '')
  channelAppId!: string

  @Expose({ name: 'channel_subject' })
  @Transform(({ value }) => value ?? '')
  channelSubject!: string

  @Expose()
  @Transform(({ value }) => value ?? {})
  metadata!: Record<string, unknown>

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => value ?? '')
  updatedAt!: string

  static fromJson(json: unknown): AdminBoundAuthIdentityChannelDto {
    return plainToInstance(AdminBoundAuthIdentityChannelDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AdminBoundAuthIdentityChannel {
    const entity = new AdminBoundAuthIdentityChannel()
    entity.channel = this.channel
    entity.channelAppId = this.channelAppId
    entity.channelSubject = this.channelSubject
    entity.metadata = this.metadata
    entity.createdAt = this.createdAt
    entity.updatedAt = this.updatedAt
    return entity
  }
}
