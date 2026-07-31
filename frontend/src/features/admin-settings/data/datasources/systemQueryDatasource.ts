import { apiClient } from '@/core/networks/client'
import { VersionInfoDto } from '@/core/models/data/versionInfoDto'
import { RollbackVersionInfoDto } from '@/features/admin-settings/data/models/rollbackVersionInfoDto'

export class SystemQueryDatasource {
  async getVersion(): Promise<{ version: string }> {
    const { data } = await apiClient.get<{ version: string }>('/admin/system/version')
    return data
  }

  async checkUpdates(force = false): Promise<VersionInfoDto> {
    const { data } = await apiClient.get<unknown>('/admin/system/check-updates', {
      params: force ? { force: 'true' } : undefined,
    })
    return VersionInfoDto.fromJson(data)
  }

  async getRollbackVersions(): Promise<RollbackVersionInfoDto[]> {
    const { data } = await apiClient.get<{ versions: unknown[] }>('/admin/system/rollback-versions')
    return (data.versions ?? []).map(v => RollbackVersionInfoDto.fromJson(v))
  }
}

export const systemQueryDatasource = new SystemQueryDatasource()
