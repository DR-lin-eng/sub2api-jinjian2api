/**
 * AnnouncementsRepositoryImpl. Auto-generated from announcementsDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/announcements/data/datasources/announcementsDatasource'
import type { AnnouncementsRepository } from '@/features/announcements/domain/repositories/announcementsRepository'

export class AnnouncementsRepositoryImpl implements AnnouncementsRepository {
  get list(): typeof ds.list { return ds.list }
  get markRead(): typeof ds.markRead { return ds.markRead }
}

export const announcementsRepository: AnnouncementsRepository = new AnnouncementsRepositoryImpl()
