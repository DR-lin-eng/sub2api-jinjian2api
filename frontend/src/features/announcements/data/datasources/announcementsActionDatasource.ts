import { apiClient } from '@/core/networks/client'

export class AnnouncementsActionDatasource {
  async markRead(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>(`/announcements/${id}/read`)
    return data
  }
}

export const announcementsActionDatasource = new AnnouncementsActionDatasource()
