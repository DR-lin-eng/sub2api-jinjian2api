export type OpsErrorListView = 'list' | 'detail'

export interface OpsErrorListQueryParams {
  page?: number
  page_size?: number
  platform?: string
  group_id?: number | null
  model?: string
  status_code?: number
  severity?: string
  resolved?: boolean
  start_time?: string
  end_time?: string
  q?: string
  view?: OpsErrorListView
  request_id?: string
  user_id?: number | null
  api_key_id?: number | null
  account_id?: number | null
}
