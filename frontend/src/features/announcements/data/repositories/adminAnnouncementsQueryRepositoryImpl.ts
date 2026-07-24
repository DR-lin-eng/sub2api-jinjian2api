import { adminAnnouncementsQueryDatasource } from '@/features/announcements/data/datasources/adminAnnouncementsQueryDatasource'
import type { AdminAnnouncementsQueryRepository } from '@/features/announcements/domain/repositories/adminAnnouncementsQueryRepository'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import type { Announcement } from '@/features/announcements/domain/models/announcement'
import type { AnnouncementUserReadStatus } from '@/features/announcements/domain/models/announcementUserReadStatus'

class AdminAnnouncementsQueryRepositoryImpl implements AdminAnnouncementsQueryRepository {
  private readonly ds = adminAnnouncementsQueryDatasource

  async list(
    page: number,
    pageSize: number,
    filters?: { status?: string; search?: string; sort_by?: string; sort_order?: 'asc' | 'desc' },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<Announcement>> {
    const res = await this.ds.list(page, pageSize, filters, options)
    return { ...res, items: res.items.map((dto) => dto.toEntity()) }
  }

  async getById(id: number): Promise<Announcement> {
    return (await this.ds.getById(id)).toEntity()
  }

  async getReadStatus(
    id: number,
    page: number,
    pageSize: number,
    filters?: { search?: string; sort_by?: string; sort_order?: 'asc' | 'desc' },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<AnnouncementUserReadStatus>> {
    const res = await this.ds.getReadStatus(id, page, pageSize, filters, options)
    return { ...res, items: res.items.map((dto) => dto.toEntity()) }
  }
}

export const adminAnnouncementsQueryRepository: AdminAnnouncementsQueryRepository =
  new AdminAnnouncementsQueryRepositoryImpl()
