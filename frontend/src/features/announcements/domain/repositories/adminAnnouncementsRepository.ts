/**
 * AdminAnnouncementsRepository (interface). Auto-generated from adminAnnouncementsDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/adminAnnouncementsRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/announcements/data/datasources/adminAnnouncementsDatasource'

export type AdminAnnouncementsRepository = {
  list: typeof ds.list
  getById: typeof ds.getById
  create: typeof ds.create
  update: typeof ds.update
  deleteAnnouncement: typeof ds.deleteAnnouncement
  getReadStatus: typeof ds.getReadStatus
}
