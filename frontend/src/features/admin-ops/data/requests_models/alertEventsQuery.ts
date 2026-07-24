export interface AlertEventsQuery {
  page?: number
  page_size?: number
  rule_id?: number
  platform?: string
  group_id?: number | null
  status?: string
  start_time?: string
  end_time?: string
}
