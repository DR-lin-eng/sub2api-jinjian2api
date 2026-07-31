import { adminAnnouncementsActionDatasource } from '@/features/announcements/data/datasources/adminAnnouncementsActionDatasource'
import type { AdminAnnouncementsActionRepository } from '@/features/announcements/domain/repositories/adminAnnouncementsActionRepository'
import type { Announcement } from '@/features/announcements/domain/models/announcement'
import type { CreateAnnouncementRequest } from '@/features/announcements/data/requests_models/createAnnouncementRequest'
import type { UpdateAnnouncementRequest } from '@/features/announcements/data/requests_models/updateAnnouncementRequest'

class AdminAnnouncementsActionRepositoryImpl implements AdminAnnouncementsActionRepository {
  private readonly ds = adminAnnouncementsActionDatasource

  create = async (req: CreateAnnouncementRequest) : Promise<Announcement>  => {
    return (await this.ds.create(req)).toEntity()
  }

  update = async (id: number, req: UpdateAnnouncementRequest) : Promise<Announcement>  => {
    return (await this.ds.update(id, req)).toEntity()
  }

  deleteAnnouncement = async (id: number) : Promise<{ message: string }>  => {
    return this.ds.deleteAnnouncement(id)
  }
}

export const adminAnnouncementsActionRepository: AdminAnnouncementsActionRepository =
  new AdminAnnouncementsActionRepositoryImpl()
