/**
 * AnnouncementsRepository (interface). Auto-generated from announcementsDatasource.ts.
 */
import type * as ds from '@/features/announcements/data/datasources/announcementsDatasource'

export type AnnouncementsRepository = {
  readonly list: typeof ds.list
  readonly markRead: typeof ds.markRead
}
