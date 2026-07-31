export interface CreateUsageCleanupTaskRequest {
  start_date: string
  end_date: string
  user_id?: number
  api_key_id?: number
  account_id?: number
  group_id?: number
  model?: string | null
  request_type?: string | null
  stream?: boolean | null
  billing_type?: number | null
  timezone?: string
}
