import { systemActionDatasource } from '@/features/admin-settings/data/datasources/systemActionDatasource'
import type { SystemActionRepository } from '@/features/admin-settings/domain/repositories/systemActionRepository'
import type { UpdateResult } from '@/features/admin-settings/domain/models/updateResult'

class SystemActionRepositoryImpl implements SystemActionRepository {
  private readonly ds = systemActionDatasource

  performUpdate = async () : Promise<UpdateResult>  => {
    return (await this.ds.performUpdate()).toEntity()
  }

  rollback = async (version?: string) : Promise<UpdateResult>  => {
    return (await this.ds.rollback(version)).toEntity()
  }

  restartService = async () : Promise<{ message: string }>  => {
    return this.ds.restartService()
  }
}

export const systemActionRepository: SystemActionRepository = new SystemActionRepositoryImpl()
