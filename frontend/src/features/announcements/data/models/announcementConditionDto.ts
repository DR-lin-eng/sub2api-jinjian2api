import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AnnouncementCondition } from '@/features/announcements/domain/models/announcementCondition'
import type { AnnouncementConditionType } from '@/features/announcements/enums/announcementConditionType'
import type { AnnouncementOperator } from '@/features/announcements/enums/announcementOperator'

export class AnnouncementConditionDto {
  @Expose()
  @Transform(({ value }) => value ?? 'subscription')
  type!: AnnouncementConditionType

  @Expose()
  @Transform(({ value }) => value ?? 'in')
  operator!: AnnouncementOperator

  @Expose({ name: 'group_ids' })
  @Transform(({ value }) => value ?? undefined)
  groupIds?: number[]

  @Expose()
  @Transform(({ value }) => value ?? undefined)
  value?: number

  static fromJson(json: unknown): AnnouncementConditionDto {
    return plainToInstance(AnnouncementConditionDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AnnouncementCondition {
    const entity = new AnnouncementCondition()
    entity.type = this.type
    entity.operator = this.operator
    entity.groupIds = this.groupIds
    entity.value = this.value
    return entity
  }
}
