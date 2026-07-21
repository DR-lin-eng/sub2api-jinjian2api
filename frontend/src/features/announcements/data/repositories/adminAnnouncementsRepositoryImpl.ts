/**
 * AdminAnnouncementsRepositoryImpl. Auto-generated from adminAnnouncementsDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/announcements/data/datasources/adminAnnouncementsDatasource'
import type { AdminAnnouncementsRepository } from '@/features/announcements/domain/repositories/adminAnnouncementsRepository'

export class AdminAnnouncementsRepositoryImpl implements AdminAnnouncementsRepository {
  get list(): typeof ds.list { return ds.list }
  get getById(): typeof ds.getById { return ds.getById }
  get create(): typeof ds.create { return ds.create }
  get update(): typeof ds.update { return ds.update }
  get deleteAnnouncement(): typeof ds.deleteAnnouncement { return ds.deleteAnnouncement }
  get getReadStatus(): typeof ds.getReadStatus { return ds.getReadStatus }
}

export const adminAnnouncementsRepository: AdminAnnouncementsRepository = new AdminAnnouncementsRepositoryImpl()
