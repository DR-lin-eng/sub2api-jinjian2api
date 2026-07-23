import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { DashboardStats } from '@/features/admin-orders/domain/models/dashboardStats'
import { DailySeriesItem } from '@/features/admin-orders/domain/models/dailySeriesItem'
import { PaymentMethodStat } from '@/features/admin-orders/domain/models/paymentMethodStat'
import { TopUser } from '@/features/admin-orders/domain/models/topUser'

export class DashboardStatsDto {
  @Expose({ name: 'today_amount' })
  @Transform(({ value }) => value ?? 0)
  todayAmount!: number

  @Expose({ name: 'total_amount' })
  @Transform(({ value }) => value ?? 0)
  totalAmount!: number

  @Expose({ name: 'today_count' })
  @Transform(({ value }) => value ?? 0)
  todayCount!: number

  @Expose({ name: 'total_count' })
  @Transform(({ value }) => value ?? 0)
  totalCount!: number

  @Expose({ name: 'avg_amount' })
  @Transform(({ value }) => value ?? 0)
  avgAmount!: number

  @Expose({ name: 'daily_series' })
  @Transform(({ value }) => value ?? [])
  dailySeries!: Array<{ date: string; amount: number; count: number }>

  @Expose({ name: 'payment_methods' })
  @Transform(({ value }) => value ?? [])
  paymentMethods!: Array<{ type: string; amount: number; count: number }>

  @Expose({ name: 'top_users' })
  @Transform(({ value }) => value ?? [])
  topUsers!: Array<{ user_id: number; email: string; amount: number }>

  static fromJson(json: unknown): DashboardStatsDto {
    return plainToInstance(DashboardStatsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): DashboardStats {
    const entity = new DashboardStats()
    entity.todayAmount = this.todayAmount
    entity.totalAmount = this.totalAmount
    entity.todayCount = this.todayCount
    entity.totalCount = this.totalCount
    entity.avgAmount = this.avgAmount
    entity.dailySeries = this.dailySeries.map(d => {
      const item = new DailySeriesItem()
      item.date = d.date ?? ''
      item.amount = d.amount ?? 0
      item.count = d.count ?? 0
      return item
    })
    entity.paymentMethods = this.paymentMethods.map(m => {
      const stat = new PaymentMethodStat()
      stat.type = m.type ?? ''
      stat.amount = m.amount ?? 0
      stat.count = m.count ?? 0
      return stat
    })
    entity.topUsers = this.topUsers.map(u => {
      const user = new TopUser()
      user.userId = u.user_id ?? 0
      user.email = u.email ?? ''
      user.amount = u.amount ?? 0
      return user
    })
    return entity
  }
}
