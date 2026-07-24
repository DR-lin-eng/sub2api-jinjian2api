import { announcementsQueryDatasource } from '@/features/announcements/data/datasources/announcementsQueryDatasource'
import type { AnnouncementsQueryRepository } from '@/features/announcements/domain/repositories/announcementsQueryRepository'
import type { UserAnnouncement } from '@/features/announcements/domain/models/userAnnouncement'
import type { ListAnnouncementsRequest } from '@/features/announcements/data/requests_models/listAnnouncementsRequest'

class AnnouncementsQueryRepositoryImpl implements AnnouncementsQueryRepository {
  private readonly ds = announcementsQueryDatasource

  async list(req: ListAnnouncementsRequest = {}): Promise<UserAnnouncement[]> {
    return (await this.ds.list(req)).map((dto) => dto.toEntity())
  }
}

export const announcementsQueryRepository: AnnouncementsQueryRepository =
  new AnnouncementsQueryRepositoryImpl()
