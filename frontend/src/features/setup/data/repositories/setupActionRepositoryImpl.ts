import { setupActionDatasource } from '@/features/setup/data/datasources/setupActionDatasource'
import type { InstallResponse } from '@/features/setup/domain/models/installResponse'
import type { TestDatabaseRequest } from '@/features/setup/data/requests_models/testDatabaseRequest'
import type { TestRedisRequest } from '@/features/setup/data/requests_models/testRedisRequest'
import type { InstallRequest } from '@/features/setup/data/requests_models/installRequest'
import type { SetupActionRepository } from '@/features/setup/domain/repositories/setupActionRepository'

class SetupActionRepositoryImpl implements SetupActionRepository {
  private readonly ds = setupActionDatasource

  async testDatabase(req: TestDatabaseRequest): Promise<void> {
    return this.ds.testDatabase(req)
  }

  async testRedis(req: TestRedisRequest): Promise<void> {
    return this.ds.testRedis(req)
  }

  async install(req: InstallRequest): Promise<InstallResponse> {
    return (await this.ds.install(req)).toEntity()
  }
}

export const setupActionRepository: SetupActionRepository = new SetupActionRepositoryImpl()
