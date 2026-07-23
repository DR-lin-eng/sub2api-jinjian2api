import type { AnnouncementUserReadStatus } from '@/features/announcements/domain/models/announcement'

export interface AnnouncementUserReadStatusDto {
  user_id: number
  email: string
  username: string
  balance: number
  eligible: boolean
  read_at?: string
}

export function toEntity(dto: AnnouncementUserReadStatusDto): AnnouncementUserReadStatus {
  return {
    userId: dto.user_id,
    email: dto.email,
    username: dto.username,
    balance: dto.balance ?? 0,
    eligible: dto.eligible ?? false,
    readAt: dto.read_at,
  }
}
