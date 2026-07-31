import type { UserUsageTrendPoint } from './userUsageTrendPoint'

export class UserTrendResponse {
  trend!: UserUsageTrendPoint[]
  startDate!: string
  endDate!: string
  granularity!: string
}
