/**
 * AnnouncementsRepository (interface). Auto-generated from announcementsDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/announcementsRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/announcements/data/datasources/announcementsDatasource'

export type AnnouncementsRepository = {
  list: typeof ds.list
  markRead: typeof ds.markRead
}
