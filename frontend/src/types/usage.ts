import type { ApiKey, Group } from './gateway'

// ==================== Usage Types ====================

export type UsageRequestType = 'unknown' | 'sync' | 'stream' | 'ws_v2' | 'cyber' | 'live'
export type ImageSizeSource = 'output' | 'input' | 'default' | 'legacy'
export type ImageSizeBreakdown = Record<string, number>

export interface UsageLog {
  id: number
  user_id: number
  api_key_id: number
  account_id: number | null
  request_id: string
  session_id?: string | null
  model: string
  service_tier?: string | null
  reasoning_effort?: string | null
  inbound_endpoint?: string | null
  upstream_endpoint?: string | null

  group_id: number | null

  input_tokens: number
  output_tokens: number
  cache_creation_tokens: number
  cache_read_tokens: number
  cache_creation_5m_tokens: number
  cache_creation_1h_tokens: number

  input_cost: number
  output_cost: number
  cache_creation_cost: number
  cache_read_cost: number
  total_cost: number
  actual_cost: number
  rate_multiplier: number
  long_context_billing_applied: boolean

  request_type?: UsageRequestType
  stream: boolean
  openai_ws_mode?: boolean
  duration_ms: number | null
  first_token_ms: number | null

  // 图片生成字段
  image_count: number
  image_size: string | null
  image_input_size: string | null
  image_output_size: string | null
  image_size_source: ImageSizeSource | null
  image_size_breakdown: ImageSizeBreakdown | null
  image_input_tokens: number
  image_input_cost: number
  image_output_tokens: number
  image_output_cost: number

  // 视频生成字段
  video_count?: number
  video_resolution?: string | null
  video_duration_seconds?: number | null

  // User-Agent
  user_agent: string | null
  ip_address?: string | null

  // Cache TTL Override
  cache_ttl_overridden: boolean

  // 计费模式
  billing_mode?: string | null

  created_at: string

  api_key?: ApiKey
  group?: Group
}

export interface UsageLogAccountSummary {
  id: number
  name: string
}

export interface AdminUsageLog extends UsageLog {
  upstream_model?: string | null
  model_mapping_chain?: string | null

  // 账号计费倍率（仅管理员可见）
  account_rate_multiplier?: number | null
  // 自定义定价规则计算的账号统计费用（nil 时使用 total_cost * multiplier）
  account_stats_cost?: number | null

  // 渠道 ID 和计费等级（仅管理员可见）
  channel_id?: number | null
  billing_tier?: string | null

  // 最小账号信息（仅管理员接口返回）
  account?: UsageLogAccountSummary
}

export interface UsageStatsResponse {
  period?: string
  total_requests: number
  total_input_tokens: number
  total_output_tokens: number
  total_cache_tokens: number
  total_cache_read_tokens: number
  total_cache_creation_tokens: number
  total_tokens: number
  total_cost: number // 标准计费
  total_actual_cost: number // 实际扣除
  average_duration_ms: number
  models?: Record<string, number>
  endpoints?: EndpointStat[]
  upstream_endpoints?: EndpointStat[]
  endpoint_paths?: EndpointStat[]
}

// ==================== Trend & Chart Types ====================

export interface TrendDataPoint {
  date: string
  requests: number
  input_tokens: number
  output_tokens: number
  cache_creation_tokens: number
  cache_read_tokens: number
  total_tokens: number
  cost: number // 标准计费
  actual_cost: number // 实际扣除
}

export interface ModelStat {
  model: string
  requests: number
  input_tokens: number
  output_tokens: number
  cache_creation_tokens: number
  cache_read_tokens: number
  total_tokens: number
  cost: number // 标准计费
  actual_cost: number // 实际扣除
  account_cost?: number // 账号成本（仅管理员接口返回）
}

export interface EndpointStat {
  endpoint: string
  requests: number
  total_tokens: number
  cost: number
  actual_cost: number
}

export interface GroupStat {
  group_id: number
  group_name: string
  requests: number
  total_tokens: number
  cost: number // 标准计费
  actual_cost: number // 实际扣除
  account_cost?: number // 账号成本（仅管理员接口返回）
}

export interface ChangePasswordRequest {
  old_password: string
  new_password: string
}

// ==================== Query Parameters ====================

export interface UserErrorRequest {
  id: number
  created_at: string
  model: string
  inbound_endpoint: string
  status_code: number
  category: string
  platform: string
  message: string
  key_name: string
  key_deleted: boolean
  client_ip?: string
  group_name?: string
  request_type?: number
  stream?: boolean
  user_agent?: string
}

export interface UserErrorRequestDetail extends UserErrorRequest {
  error_body: string
  upstream_status_code?: number
}

export interface UserErrorListParams {
  page?: number
  page_size?: number
  start_date?: string
  end_date?: string
  timezone?: string
  model?: string
  status_code?: number
  category?: string
  api_key_id?: number
  // 服务端排序,列白名单见后端 opsErrorLogsOrderBy(created_at/model/status_code)
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface UsageQueryParams {
  page?: number
  page_size?: number
  api_key_id?: number
  account_id?: number
  group_id?: number
  model?: string
  request_type?: UsageRequestType
  stream?: boolean
  billing_mode?: string | null
  start_date?: string
  end_date?: string
  timezone?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// ==================== Account Usage Statistics ====================

export interface AccountUsageHistory {
  date: string
  label: string
  requests: number
  tokens: number
  cost: number
  actual_cost: number // Account cost (account multiplier)
  user_cost: number // User/API key billed cost (group multiplier)
}

export interface AccountUsageSummary {
  days: number
  actual_days_used: number
  total_cost: number // Account cost (account multiplier)
  total_user_cost: number
  total_standard_cost: number
  total_requests: number
  total_tokens: number
  avg_daily_cost: number // Account cost
  avg_daily_user_cost: number
  avg_daily_requests: number
  avg_daily_tokens: number
  avg_duration_ms: number
  avg_first_token_ms: number | null
  today: {
    date: string
    cost: number
    user_cost: number
    requests: number
    tokens: number
  } | null
  highest_cost_day: {
    date: string
    label: string
    cost: number
    user_cost: number
    requests: number
  } | null
  highest_request_day: {
    date: string
    label: string
    requests: number
    cost: number
    user_cost: number
  } | null
}

export interface AccountUsageStatsResponse {
  history: AccountUsageHistory[]
  summary: AccountUsageSummary
  models: ModelStat[]
  endpoints: EndpointStat[]
  upstream_endpoints: EndpointStat[]
}

// ==================== TOTP (2FA) Types ====================

export interface TotpStatus {
  enabled: boolean
  enabled_at: number | null  // Unix timestamp in seconds
  feature_enabled: boolean
}

export interface TotpSetupRequest {
  password: string
}

export interface TotpSetupResponse {
  secret: string
  qr_code_url: string
  setup_token: string
  countdown: number
}

export interface TotpEnableRequest {
  totp_code: string
  setup_token: string
}

export interface TotpEnableResponse {
  success: boolean
}

export interface TotpDisableRequest {
	password: string
}

export interface TotpLoginResponse {
  requires_2fa: boolean
  temp_token?: string
  user_email_masked?: string
}

export interface TotpLogin2FARequest {
  temp_token: string
  totp_code: string
}

// ==================== Scheduled Test Types ====================

export interface ScheduledTestPlan {
  id: number
  account_id: number
  model_id: string
  cron_expression: string
  enabled: boolean
  max_results: number
  auto_recover: boolean
  last_run_at: string | null
  next_run_at: string | null
  created_at: string
  updated_at: string
}

export interface ScheduledTestResult {
  id: number
  plan_id: number
  status: string
  response_text: string
  error_message: string
  latency_ms: number
  started_at: string
  finished_at: string
  created_at: string
}

export interface CreateScheduledTestPlanRequest {
  account_id: number
  model_id: string
  cron_expression: string
  enabled?: boolean
  max_results?: number
  auto_recover?: boolean
}

export interface UpdateScheduledTestPlanRequest {
  model_id?: string
  cron_expression?: string
  enabled?: boolean
  max_results?: number
  auto_recover?: boolean
}
