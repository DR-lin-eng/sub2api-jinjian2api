import { scheduledTestsActionDatasource } from '@/features/admin-accounts/data/datasources/scheduledTestsActionDatasource'
import type { CreateScheduledTestPlanRequest } from '@/features/admin-accounts/data/requests_models/createScheduledTestPlanRequest'
import type { UpdateScheduledTestPlanRequest } from '@/features/admin-accounts/data/requests_models/updateScheduledTestPlanRequest'
import type { ScheduledTestPlan } from '@/features/admin-accounts/domain/models/scheduledTestPlan'
import type { ScheduledTestsActionRepository } from '@/features/admin-accounts/domain/repositories/scheduledTestsActionRepository'

export class ScheduledTestsActionRepositoryImpl implements ScheduledTestsActionRepository {
  private readonly ds = scheduledTestsActionDatasource

  create = async (req: CreateScheduledTestPlanRequest) : Promise<ScheduledTestPlan>  => {
    return (await this.ds.create(req)).toEntity()
  }

  update = async (id: number, req: UpdateScheduledTestPlanRequest) : Promise<ScheduledTestPlan>  => {
    return (await this.ds.update(id, req)).toEntity()
  }

  deletePlan = async (id: number) : Promise<void>  => {
    return this.ds.deletePlan(id)
  }
}

export const scheduledTestsActionRepository: ScheduledTestsActionRepository = new ScheduledTestsActionRepositoryImpl()
