import type { ScheduledTestPlan } from '@/features/admin-accounts/domain/models/scheduledTestPlan'
import type { CreateScheduledTestPlanRequest } from '@/features/admin-accounts/data/requests_models/createScheduledTestPlanRequest'
import type { UpdateScheduledTestPlanRequest } from '@/features/admin-accounts/data/requests_models/updateScheduledTestPlanRequest'

export interface ScheduledTestsActionRepository {
  create(req: CreateScheduledTestPlanRequest): Promise<ScheduledTestPlan>
  update(id: number, req: UpdateScheduledTestPlanRequest): Promise<ScheduledTestPlan>
  deletePlan(id: number): Promise<void>
}
