import type { ScheduledTestPlan } from '@/features/admin-accounts/domain/models/scheduledTestPlan'
import type { ScheduledTestResult } from '@/features/admin-accounts/domain/models/scheduledTestResult'

export interface ScheduledTestsQueryRepository {
  listByAccount(accountId: number): Promise<ScheduledTestPlan[]>
  listResults(planId: number, limit?: number): Promise<ScheduledTestResult[]>
}
