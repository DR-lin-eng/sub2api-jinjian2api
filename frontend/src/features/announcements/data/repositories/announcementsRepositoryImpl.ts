/**
 * AnnouncementsRepositoryImpl. Auto-generated from announcementsDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/announcements/data/datasources/announcementsDatasource'
import type { AnnouncementsRepository } from '@/features/announcements/domain/repositories/announcementsRepository'

export class AnnouncementsRepositoryImpl implements AnnouncementsRepository {
  list = ds.list
  markRead = ds.markRead
}

export const announcementsRepository: AnnouncementsRepository = new AnnouncementsRepositoryImpl()
