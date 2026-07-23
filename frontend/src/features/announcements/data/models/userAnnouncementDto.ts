import type {
  AnnouncementNotifyMode,
  UserAnnouncement,
} from '@/features/announcements/domain/models/announcement'

export interface UserAnnouncementDto {
  id: number
  title: string
  content: string
  notify_mode: AnnouncementNotifyMode
  starts_at?: string
  ends_at?: string
  read_at?: string
  created_at: string
  updated_at: string
}

export function toEntity(dto: UserAnnouncementDto): UserAnnouncement {
  return {
    id: dto.id,
    title: dto.title,
    content: dto.content,
    notifyMode: dto.notify_mode,
    startsAt: dto.starts_at,
    endsAt: dto.ends_at,
    readAt: dto.read_at,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}
