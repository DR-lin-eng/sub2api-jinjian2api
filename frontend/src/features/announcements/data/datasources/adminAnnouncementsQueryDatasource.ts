import { apiClient } from '@/core/networks/client'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { AnnouncementDto } from '@/features/announcements/data/models/announcementDto'
import { AnnouncementUserReadStatusDto } from '@/features/announcements/data/models/announcementUserReadStatusDto'

export class AdminAnnouncementsQueryDatasource {
  async list(
    page: number = 1,
    pageSize: number = 20,
    filters?: { status?: string; search?: string; sort_by?: string; sort_order?: 'asc' | 'desc' },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<AnnouncementDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/announcements', {
      params: { page, page_size: pageSize, ...filters },
      signal: options?.signal,
    })
    return { ...data, items: (data.items ?? []).map((item) => AnnouncementDto.fromJson(item)) }
  }

  async getById(id: number): Promise<AnnouncementDto> {
    const { data } = await apiClient.get<unknown>(`/admin/announcements/${id}`)
    return AnnouncementDto.fromJson(data)
  }

  async getReadStatus(
    id: number,
    page: number = 1,
    pageSize: number = 20,
    filters?: { search?: string; sort_by?: string; sort_order?: 'asc' | 'desc' },
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedResponse<AnnouncementUserReadStatusDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>(
      `/admin/announcements/${id}/read-status`,
      { params: { page, page_size: pageSize, ...filters }, signal: options?.signal },
    )
    return {
      ...data,
      items: (data.items ?? []).map((item) => AnnouncementUserReadStatusDto.fromJson(item)),
    }
  }
}

export const adminAnnouncementsQueryDatasource = new AdminAnnouncementsQueryDatasource()
