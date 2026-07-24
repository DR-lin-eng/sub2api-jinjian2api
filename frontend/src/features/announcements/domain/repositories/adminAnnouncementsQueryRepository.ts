import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import type { Announcement } from '@/features/announcements/domain/models/announcement'
import type { AnnouncementUserReadStatus } from '@/features/announcements/domain/models/announcementUserReadStatus'

export interface AdminAnnouncementsQueryRepository {
  list(
    page: number,
    pageSize: number,
    filters?: { status?: string; search?: string; sort_by?: string; sort_order?: 'asc' | 'desc' },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<Announcement>>
  getById(id: number): Promise<Announcement>
  getReadStatus(
    id: number,
    page: number,
    pageSize: number,
    filters?: { search?: string; sort_by?: string; sort_order?: 'asc' | 'desc' },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<AnnouncementUserReadStatus>>
}
