import type { ApiKeyDailyUsagePoint } from './apiKeyDailyUsagePoint'

export class ApiKeyDailyUsageResponse {
  items!: ApiKeyDailyUsagePoint[]
  days!: number
  startDate!: string
  endDate!: string
}
