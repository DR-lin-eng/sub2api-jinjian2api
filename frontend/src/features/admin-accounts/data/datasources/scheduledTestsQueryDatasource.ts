import { apiClient } from '@/core/networks/client'
import { ScheduledTestPlanDto } from '@/features/admin-accounts/data/models/scheduledTestPlanDto'
import { ScheduledTestResultDto } from '@/features/admin-accounts/data/models/scheduledTestResultDto'

export class ScheduledTestsQueryDatasource {
  async listByAccount(accountId: number): Promise<ScheduledTestPlanDto[]> {
    const { data } = await apiClient.get<unknown[]>(`/admin/accounts/${accountId}/scheduled-test-plans`)
    return (data ?? []).map(item => ScheduledTestPlanDto.fromJson(item))
  }

  async listResults(planId: number, limit?: number): Promise<ScheduledTestResultDto[]> {
    const { data } = await apiClient.get<unknown[]>(
      `/admin/scheduled-test-plans/${planId}/results`,
      { params: limit ? { limit } : undefined },
    )
    return (data ?? []).map(item => ScheduledTestResultDto.fromJson(item))
  }
}

export const scheduledTestsQueryDatasource = new ScheduledTestsQueryDatasource()
