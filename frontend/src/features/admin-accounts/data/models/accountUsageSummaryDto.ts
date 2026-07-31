import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { AccountUsageSummary } from '@/features/admin-accounts/domain/models/accountUsageSummary'
import { AccountUsageDayBreakdownDto } from '@/features/admin-accounts/data/models/accountUsageDayBreakdownDto'
import { AccountUsageHighestCostDayDto } from '@/features/admin-accounts/data/models/accountUsageHighestCostDayDto'
import { AccountUsageHighestRequestDayDto } from '@/features/admin-accounts/data/models/accountUsageHighestRequestDayDto'

export class AccountUsageSummaryDto {
  @Expose() @Transform(({ value }) => value ?? 0) days!: number
  @Expose({ name: 'actual_days_used' }) @Transform(({ value }) => value ?? 0) actualDaysUsed!: number
  @Expose({ name: 'total_cost' }) @Transform(({ value }) => value ?? 0) totalCost!: number
  @Expose({ name: 'total_user_cost' }) @Transform(({ value }) => value ?? 0) totalUserCost!: number
  @Expose({ name: 'total_standard_cost' }) @Transform(({ value }) => value ?? 0) totalStandardCost!: number
  @Expose({ name: 'total_requests' }) @Transform(({ value }) => value ?? 0) totalRequests!: number
  @Expose({ name: 'total_tokens' }) @Transform(({ value }) => value ?? 0) totalTokens!: number
  @Expose({ name: 'avg_daily_cost' }) @Transform(({ value }) => value ?? 0) avgDailyCost!: number
  @Expose({ name: 'avg_daily_user_cost' }) @Transform(({ value }) => value ?? 0) avgDailyUserCost!: number
  @Expose({ name: 'avg_daily_requests' }) @Transform(({ value }) => value ?? 0) avgDailyRequests!: number
  @Expose({ name: 'avg_daily_tokens' }) @Transform(({ value }) => value ?? 0) avgDailyTokens!: number
  @Expose({ name: 'avg_duration_ms' }) @Transform(({ value }) => value ?? 0) avgDurationMs!: number
  @Expose({ name: 'avg_first_token_ms' }) @Transform(({ value }) => value ?? 0) avgFirstTokenMs!: number
  @Expose() @Type(() => AccountUsageDayBreakdownDto) today?: AccountUsageDayBreakdownDto
  @Expose({ name: 'highest_cost_day' }) @Type(() => AccountUsageHighestCostDayDto) highestCostDay?: AccountUsageHighestCostDayDto
  @Expose({ name: 'highest_request_day' }) @Type(() => AccountUsageHighestRequestDayDto) highestRequestDay?: AccountUsageHighestRequestDayDto

  static fromJson(json: unknown): AccountUsageSummaryDto {
    return plainToInstance(AccountUsageSummaryDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AccountUsageSummary {
    const e = new AccountUsageSummary()
    e.days = this.days
    e.actualDaysUsed = this.actualDaysUsed
    e.totalCost = this.totalCost
    e.totalUserCost = this.totalUserCost
    e.totalStandardCost = this.totalStandardCost
    e.totalRequests = this.totalRequests
    e.totalTokens = this.totalTokens
    e.avgDailyCost = this.avgDailyCost
    e.avgDailyUserCost = this.avgDailyUserCost
    e.avgDailyRequests = this.avgDailyRequests
    e.avgDailyTokens = this.avgDailyTokens
    e.avgDurationMs = this.avgDurationMs
    e.avgFirstTokenMs = this.avgFirstTokenMs
    e.today = this.today ? this.today.toEntity() : undefined
    e.highestCostDay = this.highestCostDay ? this.highestCostDay.toEntity() : undefined
    e.highestRequestDay = this.highestRequestDay ? this.highestRequestDay.toEntity() : undefined
    return e
  }
}
