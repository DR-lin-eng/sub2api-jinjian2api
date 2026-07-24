import { systemQueryDatasource } from '@/features/admin-settings/data/datasources/systemQueryDatasource'
import type { SystemQueryRepository } from '@/features/admin-settings/domain/repositories/systemQueryRepository'
import type { VersionInfo } from '@/features/admin-settings/domain/models/versionInfo'
import type { RollbackVersionInfo } from '@/features/admin-settings/domain/models/rollbackVersionInfo'

class SystemQueryRepositoryImpl implements SystemQueryRepository {
  private readonly ds = systemQueryDatasource

  async getVersion(): Promise<{ version: string }> {
    return this.ds.getVersion()
  }

  async checkUpdates(force = false): Promise<VersionInfo> {
    return (await this.ds.checkUpdates(force)).toEntity()
  }

  async getRollbackVersions(): Promise<RollbackVersionInfo[]> {
    return (await this.ds.getRollbackVersions()).map(dto => dto.toEntity())
  }
}

export const systemQueryRepository: SystemQueryRepository = new SystemQueryRepositoryImpl()
