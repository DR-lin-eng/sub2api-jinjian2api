export interface BatchUpdateUserLimitsRequest {
  user_ids: number[]
  all?: boolean
  concurrency?: number
  rpm_limit?: number
}
