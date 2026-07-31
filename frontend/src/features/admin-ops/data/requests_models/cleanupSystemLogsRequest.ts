export interface CleanupSystemLogsRequest {
  clear_all?: boolean
  start_time?: string
  end_time?: string
  host?: string
  level?: string
  component?: string
  request_id?: string
  client_request_id?: string
  user_id?: number | null
  api_key_id?: number | null
  account_id?: number | null
  platform?: string
  model?: string
  q?: string
}
