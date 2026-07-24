import 'reflect-metadata'
import { Expose, Type, plainToInstance } from 'class-transformer'
import { AnnouncementConditionGroup } from '@/features/announcements/domain/models/announcementConditionGroup'
import { AnnouncementConditionDto } from './announcementConditionDto'

export class AnnouncementConditionGroupDto {
  @Expose({ name: 'all_of' })
  @Type(() => AnnouncementConditionDto)
  allOf?: AnnouncementConditionDto[]

  static fromJson(json: unknown): AnnouncementConditionGroupDto {
    return plainToInstance(AnnouncementConditionGroupDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AnnouncementConditionGroup {
    const entity = new AnnouncementConditionGroup()
    entity.allOf = this.allOf?.map((c) => c.toEntity())
    return entity
  }
}
