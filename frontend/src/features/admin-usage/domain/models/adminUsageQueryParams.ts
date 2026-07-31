import type { UsageRequestType } from '@/core/models/domain/usageLog'

export class AdminUsageQueryParams {
  page?: number
  pageSize?: number
  apiKeyId?: number
  userId?: number
  accountId?: number
  groupId?: number
  model?: string
  requestType?: UsageRequestType | ''
  stream?: boolean
  billingType?: number | null
  billingMode?: string
  startDate?: string
  endDate?: string
  timezone?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  errorPhase?: string
  errorCategory?: string
  statusCode?: number
  exactTotal?: boolean
}
