import type {
  AnnouncementCondition,
  AnnouncementConditionGroup,
  AnnouncementTargeting,
  Announcement,
} from '@/features/announcements/domain/models/announcement'

interface AnnouncementConditionDto {
  type: import('@/features/announcements/domain/models/announcement').AnnouncementConditionType
  operator: import('@/features/announcements/domain/models/announcement').AnnouncementOperator
  group_ids?: number[]
  value?: number
}

function announcementConditionToEntity(dto: AnnouncementConditionDto): AnnouncementCondition {
  return {
    type: dto.type,
    operator: dto.operator,
    groupIds: dto.group_ids,
    value: dto.value,
  }
}

interface AnnouncementConditionGroupDto {
  all_of?: AnnouncementConditionDto[]
}

function announcementConditionGroupToEntity(
  dto: AnnouncementConditionGroupDto,
): AnnouncementConditionGroup {
  return {
    allOf: dto.all_of?.map(announcementConditionToEntity),
  }
}

interface AnnouncementTargetingDto {
  any_of?: AnnouncementConditionGroupDto[]
}

function announcementTargetingToEntity(dto: AnnouncementTargetingDto): AnnouncementTargeting {
  return {
    anyOf: dto.any_of?.map(announcementConditionGroupToEntity),
  }
}

export interface AnnouncementDto {
  id: number
  title: string
  content: string
  status: import('@/features/announcements/domain/models/announcement').AnnouncementStatus
  notify_mode: import('@/features/announcements/domain/models/announcement').AnnouncementNotifyMode
  targeting: AnnouncementTargetingDto
  starts_at?: string
  ends_at?: string
  created_by?: number
  updated_by?: number
  created_at: string
  updated_at: string
}

export function toEntity(dto: AnnouncementDto): Announcement {
  return {
    id: dto.id,
    title: dto.title,
    content: dto.content,
    status: dto.status,
    notifyMode: dto.notify_mode,
    targeting: announcementTargetingToEntity(dto.targeting ?? {}),
    startsAt: dto.starts_at,
    endsAt: dto.ends_at,
    createdBy: dto.created_by,
    updatedBy: dto.updated_by,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  }
}
