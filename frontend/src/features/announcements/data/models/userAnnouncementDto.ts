import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UserAnnouncement } from '@/features/announcements/domain/models/userAnnouncement'
import type { AnnouncementNotifyMode } from '@/features/announcements/domain/models/announcementNotifyMode'

export class UserAnnouncementDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  title!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  content!: string

  @Expose({ name: 'notify_mode' })
  @Transform(({ value }) => value ?? 'silent')
  notifyMode!: AnnouncementNotifyMode

  @Expose({ name: 'starts_at' })
  @Transform(({ value }) => value ?? '')
  startsAt!: string

  @Expose({ name: 'ends_at' })
  @Transform(({ value }) => value ?? '')
  endsAt!: string

  @Expose({ name: 'read_at' })
  @Transform(({ value }) => value ?? '')
  readAt!: string

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => value ?? '')
  updatedAt!: string

  static fromJson(json: unknown): UserAnnouncementDto {
    return plainToInstance(UserAnnouncementDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserAnnouncement {
    const entity = new UserAnnouncement()
    entity.id = this.id
    entity.title = this.title
    entity.content = this.content
    entity.notifyMode = this.notifyMode
    entity.startsAt = this.startsAt
    entity.endsAt = this.endsAt
    entity.readAt = this.readAt
    entity.createdAt = this.createdAt
    entity.updatedAt = this.updatedAt
    return entity
  }
}
