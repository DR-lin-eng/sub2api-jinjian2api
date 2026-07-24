import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { Announcement } from '@/features/announcements/domain/models/announcement'
import type { AnnouncementStatus } from '@/features/announcements/enums/announcementStatus'
import type { AnnouncementNotifyMode } from '@/features/announcements/enums/announcementNotifyMode'
import { AnnouncementTargetingDto } from './announcementTargetingDto'
import { AnnouncementTargeting } from '@/features/announcements/domain/models/announcementTargeting'

export class AnnouncementDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  title!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  content!: string

  @Expose()
  @Transform(({ value }) => value ?? 'draft')
  status!: AnnouncementStatus

  @Expose({ name: 'notify_mode' })
  @Transform(({ value }) => value ?? 'silent')
  notifyMode!: AnnouncementNotifyMode

  @Expose()
  @Type(() => AnnouncementTargetingDto)
  targeting!: AnnouncementTargetingDto

  @Expose({ name: 'starts_at' })
  @Transform(({ value }) => value ?? '')
  startsAt!: string

  @Expose({ name: 'ends_at' })
  @Transform(({ value }) => value ?? '')
  endsAt!: string

  @Expose({ name: 'created_by' })
  @Transform(({ value }) => value ?? 0)
  createdBy!: number

  @Expose({ name: 'updated_by' })
  @Transform(({ value }) => value ?? 0)
  updatedBy!: number

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => value ?? '')
  updatedAt!: string

  static fromJson(json: unknown): AnnouncementDto {
    return plainToInstance(AnnouncementDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): Announcement {
    const entity = new Announcement()
    entity.id = this.id
    entity.title = this.title
    entity.content = this.content
    entity.status = this.status
    entity.notifyMode = this.notifyMode
    entity.targeting = this.targeting ? this.targeting.toEntity() : new AnnouncementTargeting()
    entity.startsAt = this.startsAt
    entity.endsAt = this.endsAt
    entity.createdBy = this.createdBy
    entity.updatedBy = this.updatedBy
    entity.createdAt = this.createdAt
    entity.updatedAt = this.updatedAt
    return entity
  }
}
