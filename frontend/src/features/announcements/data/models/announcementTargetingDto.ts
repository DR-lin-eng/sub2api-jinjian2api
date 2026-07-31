import 'reflect-metadata'
import { Expose, Type, plainToInstance } from 'class-transformer'
import { AnnouncementTargeting } from '@/features/announcements/domain/models/announcementTargeting'
import { AnnouncementConditionGroupDto } from './announcementConditionGroupDto'

export class AnnouncementTargetingDto {
  @Expose({ name: 'any_of' })
  @Type(() => AnnouncementConditionGroupDto)
  anyOf?: AnnouncementConditionGroupDto[]

  static fromJson(json: unknown): AnnouncementTargetingDto {
    return plainToInstance(AnnouncementTargetingDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AnnouncementTargeting {
    const entity = new AnnouncementTargeting()
    entity.anyOf = this.anyOf?.map((g) => g.toEntity())
    return entity
  }
}
