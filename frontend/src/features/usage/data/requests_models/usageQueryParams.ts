export interface UsageQueryParams {
  page?: number
  pageSize?: number
  apiKeyId?: number
  userId?: number
  accountId?: number
  groupId?: number
  model?: string
  requestType?: import('@/features/admin-usage/enums/usageRequestType').UsageRequestType
  stream?: boolean
  billingType?: number | null
  billingMode?: string | null
  startDate?: string
  endDate?: string
  timezone?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
