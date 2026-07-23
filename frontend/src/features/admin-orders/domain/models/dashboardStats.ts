import type { DailySeriesItem } from './dailySeriesItem'
import type { PaymentMethodStat } from './paymentMethodStat'
import type { TopUser } from './topUser'

export class DashboardStats {
  todayAmount!: number
  totalAmount!: number
  todayCount!: number
  totalCount!: number
  avgAmount!: number
  dailySeries!: DailySeriesItem[]
  paymentMethods!: PaymentMethodStat[]
  topUsers!: TopUser[]
}
