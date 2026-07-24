export interface AnnouncementsActionRepository {
  markRead(id: number): Promise<{ message: string }>
}
