import type { AnnouncementStatus } from '@/features/announcements/enums/announcementStatus'
import type { AnnouncementNotifyMode } from '@/features/announcements/enums/announcementNotifyMode'
import type { AnnouncementTargeting } from './announcementTargeting'

export class Announcement {
  id!: number
  title!: string
  content!: string
  status!: AnnouncementStatus
  notifyMode!: AnnouncementNotifyMode
  targeting!: AnnouncementTargeting
  startsAt!: string
  endsAt!: string
  createdBy!: number
  updatedBy!: number
  createdAt!: string
  updatedAt!: string
}
