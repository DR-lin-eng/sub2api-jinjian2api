import type { UsageRequestType } from '@/core/models/domain/usageLog'

export interface AdminDashboardGroupStatsRequest {
  start_date?: string
  end_date?: string
  user_id?: number
  api_key_id?: number
  account_id?: number
  group_id?: number
  request_type?: UsageRequestType
  stream?: boolean
  billing_type?: number | null
}
