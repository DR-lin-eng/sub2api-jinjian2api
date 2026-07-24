import { announcementsActionDatasource } from '@/features/announcements/data/datasources/announcementsActionDatasource'
import type { AnnouncementsActionRepository } from '@/features/announcements/domain/repositories/announcementsActionRepository'

class AnnouncementsActionRepositoryImpl implements AnnouncementsActionRepository {
  private readonly ds = announcementsActionDatasource

  async markRead(id: number): Promise<{ message: string }> {
    return this.ds.markRead(id)
  }
}

export const announcementsActionRepository: AnnouncementsActionRepository =
  new AnnouncementsActionRepositoryImpl()
