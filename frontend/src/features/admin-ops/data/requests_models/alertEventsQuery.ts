export interface AlertEventsQuery {
  page?: number
  page_size?: number
  limit?: number
  rule_id?: number
  platform?: string
  group_id?: number | null
  status?: string
  severity?: string
  emailSent?: boolean
  time_range?: string
  start_time?: string
  end_time?: string
  before_fired_at?: string
  before_id?: number
}
