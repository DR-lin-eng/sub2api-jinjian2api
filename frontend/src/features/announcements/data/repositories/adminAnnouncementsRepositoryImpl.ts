/**
 * AdminAnnouncementsRepositoryImpl. Auto-generated from adminAnnouncementsDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/announcements/data/datasources/adminAnnouncementsDatasource'
import type { AdminAnnouncementsRepository } from '@/features/announcements/domain/repositories/adminAnnouncementsRepository'

export class AdminAnnouncementsRepositoryImpl implements AdminAnnouncementsRepository {
  list = ds.list
  getById = ds.getById
  create = ds.create
  update = ds.update
  deleteAnnouncement = ds.deleteAnnouncement
  getReadStatus = ds.getReadStatus
}

export const adminAnnouncementsRepository: AdminAnnouncementsRepository = new AdminAnnouncementsRepositoryImpl()
