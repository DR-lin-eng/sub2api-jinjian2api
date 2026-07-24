import { apiClient } from '@/core/networks/client'
import { UsageCleanupTaskDto } from '@/features/admin-usage/data/models/usageCleanupTaskDto'
import { UpdateApiKeyGroupResultDto } from '@/features/admin-usage/data/models/updateApiKeyGroupResultDto'
import type { CreateUsageCleanupTaskRequest } from '@/features/admin-usage/data/requests_models/createUsageCleanupTaskRequest'
import type { UpdateApiKeyGroupRequest } from '@/features/admin-usage/data/requests_models/updateApiKeyGroupRequest'

export class AdminUsageActionDatasource {
  async createCleanupTask(req: CreateUsageCleanupTaskRequest): Promise<UsageCleanupTaskDto> {
    const { data } = await apiClient.post<unknown>('/admin/usage/cleanup-tasks', req)
    return UsageCleanupTaskDto.fromJson(data)
  }

  async cancelCleanupTask(taskId: number): Promise<{ id: number; status: string }> {
    const { data } = await apiClient.post<{ id: number; status: string }>(
      `/admin/usage/cleanup-tasks/${taskId}/cancel`,
    )
    return data
  }

  async updateApiKeyGroup(id: number, req: UpdateApiKeyGroupRequest): Promise<UpdateApiKeyGroupResultDto> {
    const { data } = await apiClient.put<unknown>(`/admin/api-keys/${id}`, req)
    return UpdateApiKeyGroupResultDto.fromJson(data)
  }
}

export const adminUsageActionDatasource = new AdminUsageActionDatasource()
