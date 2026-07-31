import type { UsageCleanupTask } from '@/features/admin-usage/domain/models/usageCleanupTask'
import type { UpdateApiKeyGroupResult } from '@/features/admin-usage/domain/models/updateApiKeyGroupResult'
import type { CreateUsageCleanupTaskRequest } from '@/features/admin-usage/data/requests_models/createUsageCleanupTaskRequest'
import type { UpdateApiKeyGroupRequest } from '@/features/admin-usage/data/requests_models/updateApiKeyGroupRequest'

export interface AdminUsageActionRepository {
  createCleanupTask(req: CreateUsageCleanupTaskRequest): Promise<UsageCleanupTask>
  cancelCleanupTask(taskId: number): Promise<{ id: number; status: string }>
  updateApiKeyGroup(id: number, req: UpdateApiKeyGroupRequest): Promise<UpdateApiKeyGroupResult>
}
