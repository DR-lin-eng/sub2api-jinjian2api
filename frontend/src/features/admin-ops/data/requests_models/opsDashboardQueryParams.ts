export type OpsQueryMode = 'realtime' | 'historical' | string

export interface OpsRequestOptions {
  signal?: AbortSignal
}

export interface OpsDashboardQueryParams {
  time_range?: string
  start_time?: string
  end_time?: string
  platform?: string
  group_id?: number | null
  mode?: OpsQueryMode
}

export interface OpsDashboardSnapshotV2Params extends OpsDashboardQueryParams {
  include_throughput_trend?: boolean
  include_latency_histogram?: boolean
  include_error_trend?: boolean
  include_error_distribution?: boolean
}
