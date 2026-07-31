export class UserErrorListParams {
  page?: number
  pageSize?: number
  startDate?: string
  endDate?: string
  timezone?: string
  model?: string
  statusCode?: number
  category?: string
  apiKeyId?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
