import type { AnnouncementStatus } from '@/features/announcements/domain/models/announcementStatus'
import type { AnnouncementNotifyMode } from '@/features/announcements/domain/models/announcementNotifyMode'
import type { AnnouncementTargeting } from '@/features/announcements/domain/models/announcementTargeting'

export interface UpdateAnnouncementRequest {
  title?: string
  content?: string
  status?: AnnouncementStatus
  notify_mode?: AnnouncementNotifyMode
  targeting?: AnnouncementTargeting
  starts_at?: number
  ends_at?: number
}
