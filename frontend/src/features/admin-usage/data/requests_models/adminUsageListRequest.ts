export interface AdminUsageListRequest {
  page?: number
  page_size?: number
  api_key_id?: number
  user_id?: number
  account_id?: number
  group_id?: number
  model?: string
  request_type?: string
  stream?: boolean
  billing_type?: number | null
  billing_mode?: string | null
  start_date?: string
  end_date?: string
  timezone?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  error_phase?: string | null
  error_category?: string | null
  status_code?: number | null
  exact_total?: boolean
}
