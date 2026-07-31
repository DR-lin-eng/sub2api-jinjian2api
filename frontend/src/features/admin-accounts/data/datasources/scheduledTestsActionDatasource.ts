import { apiClient } from '@/core/networks/client'
import { ScheduledTestPlanDto } from '@/features/admin-accounts/data/models/scheduledTestPlanDto'
import type { CreateScheduledTestPlanRequest } from '@/features/admin-accounts/data/requests_models/createScheduledTestPlanRequest'
import type { UpdateScheduledTestPlanRequest } from '@/features/admin-accounts/data/requests_models/updateScheduledTestPlanRequest'

export class ScheduledTestsActionDatasource {
  async create(req: CreateScheduledTestPlanRequest): Promise<ScheduledTestPlanDto> {
    const { data } = await apiClient.post<unknown>('/admin/scheduled-test-plans', req)
    return ScheduledTestPlanDto.fromJson(data)
  }

  async update(id: number, req: UpdateScheduledTestPlanRequest): Promise<ScheduledTestPlanDto> {
    const { data } = await apiClient.put<unknown>(`/admin/scheduled-test-plans/${id}`, req)
    return ScheduledTestPlanDto.fromJson(data)
  }

  async deletePlan(id: number): Promise<void> {
    await apiClient.delete(`/admin/scheduled-test-plans/${id}`)
  }
}

export const scheduledTestsActionDatasource = new ScheduledTestsActionDatasource()
