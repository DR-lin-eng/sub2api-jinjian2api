export type AnnouncementConditionType = 'subscription' | 'balance'
export type AnnouncementOperator = 'in' | 'gt' | 'gte' | 'lt' | 'lte' | 'eq'

export class AnnouncementCondition {
  type!: AnnouncementConditionType
  operator!: AnnouncementOperator
  groupIds?: number[]
  value?: number
}
