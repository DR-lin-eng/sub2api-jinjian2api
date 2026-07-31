import { apiClient } from '@/core/networks/client'
import { AnnouncementDto } from '@/features/announcements/data/models/announcementDto'
import type { CreateAnnouncementRequest } from '@/features/announcements/data/requests_models/createAnnouncementRequest'
import type { UpdateAnnouncementRequest } from '@/features/announcements/data/requests_models/updateAnnouncementRequest'

export class AdminAnnouncementsActionDatasource {
  async create(req: CreateAnnouncementRequest): Promise<AnnouncementDto> {
    const { data } = await apiClient.post<unknown>('/admin/announcements', req)
    return AnnouncementDto.fromJson(data)
  }

  async update(id: number, req: UpdateAnnouncementRequest): Promise<AnnouncementDto> {
    const { data } = await apiClient.put<unknown>(`/admin/announcements/${id}`, req)
    return AnnouncementDto.fromJson(data)
  }

  async deleteAnnouncement(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/announcements/${id}`)
    return data
  }
}

export const adminAnnouncementsActionDatasource = new AdminAnnouncementsActionDatasource()
