/**
 * AdminAnnouncementsRepository (interface). Auto-generated from adminAnnouncementsDatasource.ts.
 */
import type * as ds from '@/features/announcements/data/datasources/adminAnnouncementsDatasource'

export type AdminAnnouncementsRepository = {
  readonly list: typeof ds.list
  readonly getById: typeof ds.getById
  readonly create: typeof ds.create
  readonly update: typeof ds.update
  readonly deleteAnnouncement: typeof ds.deleteAnnouncement
  readonly getReadStatus: typeof ds.getReadStatus
}
