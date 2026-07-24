import type { AnnouncementStatus } from './announcementStatus'
import type { AnnouncementNotifyMode } from './announcementNotifyMode'
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
