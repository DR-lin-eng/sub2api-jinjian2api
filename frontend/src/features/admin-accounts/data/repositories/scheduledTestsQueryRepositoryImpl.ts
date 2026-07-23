import { scheduledTestsQueryDatasource } from '@/features/admin-accounts/data/datasources/scheduledTestsQueryDatasource'
import type { ScheduledTestPlan } from '@/features/admin-accounts/domain/models/scheduledTestPlan'
import type { ScheduledTestResult } from '@/features/admin-accounts/domain/models/scheduledTestResult'
import type { ScheduledTestsQueryRepository } from '@/features/admin-accounts/domain/repositories/scheduledTestsQueryRepository'

export class ScheduledTestsQueryRepositoryImpl implements ScheduledTestsQueryRepository {
  private readonly ds = scheduledTestsQueryDatasource

  async listByAccount(accountId: number): Promise<ScheduledTestPlan[]> {
    return (await this.ds.listByAccount(accountId)).map(dto => dto.toEntity())
  }

  async listResults(planId: number, limit?: number): Promise<ScheduledTestResult[]> {
    return (await this.ds.listResults(planId, limit)).map(dto => dto.toEntity())
  }
}

export const scheduledTestsQueryRepository: ScheduledTestsQueryRepository = new ScheduledTestsQueryRepositoryImpl()
