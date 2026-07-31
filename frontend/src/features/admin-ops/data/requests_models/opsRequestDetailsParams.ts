export type OpsRequestKind = 'success' | 'error'
export type OpsRequestDetailsKind = 'all' | 'success' | 'error'
export type OpsRequestDetailsSort = 'created_at' | 'duration_ms' | 'first_token_ms'

export interface OpsRequestDetailsParams {
  page?: number
  page_size?: number
  platform?: string
  group_id?: number | null
  model?: string
  kind?: OpsRequestDetailsKind
  sort?: OpsRequestDetailsSort
  sort_dir?: 'asc' | 'desc'
  start_time?: string
  end_time?: string
  user_id?: number | null
  api_key_id?: number | null
  account_id?: number | null
  q?: string
}

export interface OpsRequestDetailsResponse {
  items: import('@/features/admin-ops/domain/models/opsRequestDetail').OpsRequestDetail[]
  total: number
  page: number
  page_size: number
}
