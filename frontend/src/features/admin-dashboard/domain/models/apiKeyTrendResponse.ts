import type { ApiKeyUsageTrendPoint } from './apiKeyUsageTrendPoint'

export class ApiKeyTrendResponse {
  trend!: ApiKeyUsageTrendPoint[]
  startDate!: string
  endDate!: string
  granularity!: string
}
