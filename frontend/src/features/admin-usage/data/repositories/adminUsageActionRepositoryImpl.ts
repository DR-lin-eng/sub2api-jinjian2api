import { adminUsageActionDatasource } from '@/features/admin-usage/data/datasources/adminUsageActionDatasource'
import type { AdminUsageActionRepository } from '@/features/admin-usage/domain/repositories/adminUsageActionRepository'
import type { UsageCleanupTask } from '@/features/admin-usage/domain/models/usageCleanupTask'
import type { UpdateApiKeyGroupResult } from '@/features/admin-usage/domain/models/updateApiKeyGroupResult'
import type { CreateUsageCleanupTaskRequest } from '@/features/admin-usage/data/requests_models/createUsageCleanupTaskRequest'
import type { UpdateApiKeyGroupRequest } from '@/features/admin-usage/data/requests_models/updateApiKeyGroupRequest'

class AdminUsageActionRepositoryImpl implements AdminUsageActionRepository {
  private readonly ds = adminUsageActionDatasource

  createCleanupTask = async (req: CreateUsageCleanupTaskRequest) : Promise<UsageCleanupTask>  => {
    return (await this.ds.createCleanupTask(req)).toEntity()
  }

  cancelCleanupTask = async (taskId: number) : Promise<{ id: number; status: string }>  => {
    return this.ds.cancelCleanupTask(taskId)
  }

  updateApiKeyGroup = async (id: number, req: UpdateApiKeyGroupRequest) : Promise<UpdateApiKeyGroupResult>  => {
    return (await this.ds.updateApiKeyGroup(id, req)).toEntity()
  }
}

export const adminUsageActionRepository: AdminUsageActionRepository = new AdminUsageActionRepositoryImpl()
