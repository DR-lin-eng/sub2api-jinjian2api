import type { UsageRequestType } from '@/core/models/domain/usageLog'

export interface UsageTrendParams {
  start_date?: string
  end_date?: string
  granularity?: 'day' | 'hour'
  api_key_id?: number
  model?: string
  group_id?: number
  request_type?: UsageRequestType
  stream?: boolean
  billing_type?: number | null
  billing_mode?: string | null
  timezone?: string
}
