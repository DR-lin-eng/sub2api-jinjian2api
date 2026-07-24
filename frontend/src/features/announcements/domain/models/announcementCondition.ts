import type { AnnouncementConditionType } from '@/features/announcements/enums/announcementConditionType'
import type { AnnouncementOperator } from '@/features/announcements/enums/announcementOperator'

export class AnnouncementCondition {
  type!: AnnouncementConditionType
  operator!: AnnouncementOperator
  groupIds?: number[]
  value?: number
}
