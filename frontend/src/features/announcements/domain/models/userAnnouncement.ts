import type { AnnouncementNotifyMode } from './announcementNotifyMode'

export class UserAnnouncement {
  id!: number
  title!: string
  content!: string
  notifyMode!: AnnouncementNotifyMode
  startsAt!: string
  endsAt!: string
  readAt!: string
  createdAt!: string
  updatedAt!: string
}
