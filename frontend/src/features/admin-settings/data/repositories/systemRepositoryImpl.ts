/**
 * SystemRepositoryImpl. Auto-generated from systemDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-settings/data/datasources/systemDatasource'
import type { SystemRepository } from '@/features/admin-settings/domain/repositories/systemRepository'

export class SystemRepositoryImpl implements SystemRepository {
  get getVersion(): typeof ds.getVersion { return ds.getVersion }
  get checkUpdates(): typeof ds.checkUpdates { return ds.checkUpdates }
  get getRollbackVersions(): typeof ds.getRollbackVersions { return ds.getRollbackVersions }
  get performUpdate(): typeof ds.performUpdate { return ds.performUpdate }
  get rollback(): typeof ds.rollback { return ds.rollback }
  get restartService(): typeof ds.restartService { return ds.restartService }
}

export const systemRepository: SystemRepository = new SystemRepositoryImpl()
