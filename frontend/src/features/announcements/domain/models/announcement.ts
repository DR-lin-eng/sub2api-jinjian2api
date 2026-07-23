export type AnnouncementStatus = 'draft' | 'active' | 'archived'
export type AnnouncementNotifyMode = 'silent' | 'popup'
export type AnnouncementConditionType = 'subscription' | 'balance'
export type AnnouncementOperator = 'in' | 'gt' | 'gte' | 'lt' | 'lte' | 'eq'

export interface AnnouncementCondition {
  type: AnnouncementConditionType
  operator: AnnouncementOperator
  groupIds?: number[]
  value?: number
}

export interface AnnouncementConditionGroup {
  allOf?: AnnouncementCondition[]
}

export interface AnnouncementTargeting {
  anyOf?: AnnouncementConditionGroup[]
}

export interface Announcement {
  id: number
  title: string
  content: string
  status: AnnouncementStatus
  notifyMode: AnnouncementNotifyMode
  targeting: AnnouncementTargeting
  startsAt?: string
  endsAt?: string
  createdBy?: number
  updatedBy?: number
  createdAt: string
  updatedAt: string
}

export interface UserAnnouncement {
  id: number
  title: string
  content: string
  notifyMode: AnnouncementNotifyMode
  startsAt?: string
  endsAt?: string
  readAt?: string
  createdAt: string
  updatedAt: string
}

export interface AnnouncementUserReadStatus {
  userId: number
  email: string
  username: string
  balance: number
  eligible: boolean
  readAt?: string
}

export interface CreateAnnouncementRequest {
  title: string
  content: string
  status?: AnnouncementStatus
  notifyMode?: AnnouncementNotifyMode
  targeting: AnnouncementTargeting
  startsAt?: number
  endsAt?: number
}

export interface UpdateAnnouncementRequest {
  title?: string
  content?: string
  status?: AnnouncementStatus
  notifyMode?: AnnouncementNotifyMode
  targeting?: AnnouncementTargeting
  startsAt?: number
  endsAt?: number
}
