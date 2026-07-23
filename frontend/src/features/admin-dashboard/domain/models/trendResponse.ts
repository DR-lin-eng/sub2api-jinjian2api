import type { TrendDataPoint } from './trendDataPoint'

export class TrendResponse {
  trend!: TrendDataPoint[]
  startDate!: string
  endDate!: string
  granularity!: string
}
