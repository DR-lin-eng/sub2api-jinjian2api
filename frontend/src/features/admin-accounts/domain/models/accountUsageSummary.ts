import { AccountUsageDayBreakdown } from '@/features/admin-accounts/domain/models/accountUsageDayBreakdown'
import { AccountUsageHighestCostDay } from '@/features/admin-accounts/domain/models/accountUsageHighestCostDay'
import { AccountUsageHighestRequestDay } from '@/features/admin-accounts/domain/models/accountUsageHighestRequestDay'

export class AccountUsageSummary {
  days!: number
  actualDaysUsed!: number
  totalCost!: number
  totalUserCost!: number
  totalStandardCost!: number
  totalRequests!: number
  totalTokens!: number
  avgDailyCost!: number
  avgDailyUserCost!: number
  avgDailyRequests!: number
  avgDailyTokens!: number
  avgDurationMs!: number
  avgFirstTokenMs!: number
  today?: AccountUsageDayBreakdown
  highestCostDay?: AccountUsageHighestCostDay
  highestRequestDay?: AccountUsageHighestRequestDay
}
