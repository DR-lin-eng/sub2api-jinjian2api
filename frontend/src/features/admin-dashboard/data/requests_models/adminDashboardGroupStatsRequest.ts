import type { UsageRequestType } from '@/features/admin-usage/domain/models/adminUsage'

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
