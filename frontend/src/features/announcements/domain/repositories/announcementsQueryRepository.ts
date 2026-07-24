import type { UserAnnouncement } from '@/features/announcements/domain/models/userAnnouncement'
import type { ListAnnouncementsRequest } from '@/features/announcements/data/requests_models/listAnnouncementsRequest'

export interface AnnouncementsQueryRepository {
  list(req?: ListAnnouncementsRequest): Promise<UserAnnouncement[]>
}
