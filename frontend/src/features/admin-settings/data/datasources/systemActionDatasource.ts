import { apiClient } from '@/core/networks/client'
import { UpdateResultDto } from '@/features/admin-settings/data/models/updateResultDto'

const UPDATE_REQUEST_TIMEOUT_MS = 15 * 60 * 1000

export class SystemActionDatasource {
  async performUpdate(): Promise<UpdateResultDto> {
    const { data } = await apiClient.post<unknown>('/admin/system/update', undefined, {
      timeout: UPDATE_REQUEST_TIMEOUT_MS,
    })
    return UpdateResultDto.fromJson(data)
  }

  async rollback(version?: string): Promise<UpdateResultDto> {
    const { data } = await apiClient.post<unknown>(
      '/admin/system/rollback',
      version ? { version } : undefined,
      { timeout: UPDATE_REQUEST_TIMEOUT_MS }
    )
    return UpdateResultDto.fromJson(data)
  }

  async restartService(): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>('/admin/system/restart')
    return data
  }
}

export const systemActionDatasource = new SystemActionDatasource()
