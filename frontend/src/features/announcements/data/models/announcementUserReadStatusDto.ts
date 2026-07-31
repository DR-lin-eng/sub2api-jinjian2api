import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AnnouncementUserReadStatus } from '@/features/announcements/domain/models/announcementUserReadStatus'

export class AnnouncementUserReadStatusDto {
  @Expose({ name: 'user_id' })
  @Transform(({ value }) => value ?? 0)
  userId!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  email!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  username!: string

  @Expose()
  @Transform(({ value }) => value ?? 0)
  balance!: number

  @Expose()
  @Transform(({ value }) => value ?? false)
  eligible!: boolean

  @Expose({ name: 'read_at' })
  @Transform(({ value }) => value ?? '')
  readAt!: string

  static fromJson(json: unknown): AnnouncementUserReadStatusDto {
    return plainToInstance(AnnouncementUserReadStatusDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AnnouncementUserReadStatus {
    const entity = new AnnouncementUserReadStatus()
    entity.userId = this.userId
    entity.email = this.email
    entity.username = this.username
    entity.balance = this.balance
    entity.eligible = this.eligible
    entity.readAt = this.readAt
    return entity
  }
}
