import { systemQueryDatasource } from '@/features/admin-settings/data/datasources/systemQueryDatasource'
import type { SystemQueryRepository } from '@/features/admin-settings/domain/repositories/systemQueryRepository'
import type { VersionInfo } from '@/core/models/domain/versionInfo'
import type { RollbackVersionInfo } from '@/features/admin-settings/domain/models/rollbackVersionInfo'

class SystemQueryRepositoryImpl implements SystemQueryRepository {
  private readonly ds = systemQueryDatasource

  getVersion = async () : Promise<{ version: string }>  => {
    return this.ds.getVersion()
  }

  checkUpdates = async (force = false) : Promise<VersionInfo>  => {
    return (await this.ds.checkUpdates(force)).toEntity()
  }

  getRollbackVersions = async () : Promise<RollbackVersionInfo[]>  => {
    return (await this.ds.getRollbackVersions()).map(dto => dto.toEntity())
  }
}

export const systemQueryRepository: SystemQueryRepository = new SystemQueryRepositoryImpl()
