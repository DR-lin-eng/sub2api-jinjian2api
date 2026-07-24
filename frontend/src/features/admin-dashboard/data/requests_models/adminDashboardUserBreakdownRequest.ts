import type { UsageRequestType } from '@/core/models/domain/usageLog'

export interface AdminDashboardUserBreakdownRequest {
  start_date?: string
  end_date?: string
  group_id?: number
  model?: string
  model_source?: 'requested' | 'upstream' | 'mapping'
  endpoint?: string
  endpoint_type?: 'inbound' | 'upstream' | 'path'
  limit?: number
  sort_by?: 'total_tokens' | 'input_tokens' | 'output_tokens' | 'cache_tokens' | 'requests' | 'cost' | 'actual_cost'
  user_id?: number
  api_key_id?: number
  account_id?: number
  request_type?: UsageRequestType
  stream?: boolean
  billing_type?: number | null
}
