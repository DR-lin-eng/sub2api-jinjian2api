export interface UsageDashboardApiKeysUsageRequest {
  api_key_ids: number[]
  start_date?: string
  end_date?: string
  timezone?: string
}
