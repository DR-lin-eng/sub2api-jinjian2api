import { adminAnnouncementsActionDatasource } from '@/features/announcements/data/datasources/adminAnnouncementsActionDatasource'
import type { AdminAnnouncementsActionRepository } from '@/features/announcements/domain/repositories/adminAnnouncementsActionRepository'
import type { Announcement } from '@/features/announcements/domain/models/announcement'
import type { CreateAnnouncementRequest } from '@/features/announcements/data/requests_models/createAnnouncementRequest'
import type { UpdateAnnouncementRequest } from '@/features/announcements/data/requests_models/updateAnnouncementRequest'

class AdminAnnouncementsActionRepositoryImpl implements AdminAnnouncementsActionRepository {
  private readonly ds = adminAnnouncementsActionDatasource

  async create(req: CreateAnnouncementRequest): Promise<Announcement> {
    return (await this.ds.create(req)).toEntity()
  }

  async update(id: number, req: UpdateAnnouncementRequest): Promise<Announcement> {
    return (await this.ds.update(id, req)).toEntity()
  }

  async deleteAnnouncement(id: number): Promise<{ message: string }> {
    return this.ds.deleteAnnouncement(id)
  }
}

export const adminAnnouncementsActionRepository: AdminAnnouncementsActionRepository =
  new AdminAnnouncementsActionRepositoryImpl()
