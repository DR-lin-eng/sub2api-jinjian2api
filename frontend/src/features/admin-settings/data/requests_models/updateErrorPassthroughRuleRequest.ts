export interface UpdateErrorPassthroughRuleRequest {
  name?: string
  enabled?: boolean
  priority?: number
  error_codes?: number[]
  keywords?: string[]
  match_mode?: 'any' | 'all'
  platforms?: string[]
  passthrough_code?: boolean
  response_code?: number | null
  passthrough_body?: boolean
  custom_message?: string | null
  skip_monitoring?: boolean
  description?: string | null
}
