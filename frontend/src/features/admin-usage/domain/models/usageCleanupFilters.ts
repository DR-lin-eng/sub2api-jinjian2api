import type { UsageRequestType } from '@/core/models/domain/usageLog'

export class UsageCleanupFilters {
  startTime!: string
  endTime!: string
  userId!: number
  apiKeyId!: number
  accountId!: number
  groupId!: number
  model!: string
  requestType!: UsageRequestType | ''
  stream!: boolean
  billingType!: number
}
