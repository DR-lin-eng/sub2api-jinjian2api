export type OpsOpenAITokenStatsTimeRange = '1h' | '6h' | '24h' | '7d' | '30d' | string

export interface OpsOpenAITokenStatsParams {
  time_range?: OpsOpenAITokenStatsTimeRange
  start_time?: string
  end_time?: string
  platform?: string
  group_id?: number | null
  page?: number
  page_size?: number
  top_n?: number
}
