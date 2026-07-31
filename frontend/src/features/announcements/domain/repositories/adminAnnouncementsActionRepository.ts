import type { Announcement } from '@/features/announcements/domain/models/announcement'
import type { CreateAnnouncementRequest } from '@/features/announcements/data/requests_models/createAnnouncementRequest'
import type { UpdateAnnouncementRequest } from '@/features/announcements/data/requests_models/updateAnnouncementRequest'

export interface AdminAnnouncementsActionRepository {
  create(req: CreateAnnouncementRequest): Promise<Announcement>
  update(id: number, req: UpdateAnnouncementRequest): Promise<Announcement>
  deleteAnnouncement(id: number): Promise<{ message: string }>
}
