import { apiClient } from '@/core/networks/client'
import { UserAnnouncementDto } from '@/features/announcements/data/models/userAnnouncementDto'
import type { ListAnnouncementsRequest } from '@/features/announcements/data/requests_models/listAnnouncementsRequest'

export class AnnouncementsQueryDatasource {
  async list(req: ListAnnouncementsRequest = {}): Promise<UserAnnouncementDto[]> {
    const { data } = await apiClient.get<unknown[]>('/announcements', { params: req })
    return (data ?? []).map((item) => UserAnnouncementDto.fromJson(item))
  }
}

export const announcementsQueryDatasource = new AnnouncementsQueryDatasource()
