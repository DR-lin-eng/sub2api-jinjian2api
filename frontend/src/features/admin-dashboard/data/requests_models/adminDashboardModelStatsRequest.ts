import type { UsageRequestType } from '@/features/admin-usage/domain/models/adminUsage'

export interface AdminDashboardModelStatsRequest {
  start_date?: string
  end_date?: string
  user_id?: number
  api_key_id?: number
  model?: string
  model_source?: 'requested' | 'upstream' | 'mapping'
  account_id?: number
  group_id?: number
  request_type?: UsageRequestType
  stream?: boolean
  billing_type?: number | null
}
