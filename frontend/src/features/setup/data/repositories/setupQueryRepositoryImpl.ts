import { setupQueryDatasource } from '@/features/setup/data/datasources/setupQueryDatasource'
import type { SetupStatus } from '@/features/setup/domain/models/setupStatus'
import type { SetupQueryRepository } from '@/features/setup/domain/repositories/setupQueryRepository'

class SetupQueryRepositoryImpl implements SetupQueryRepository {
  private readonly ds = setupQueryDatasource

  async getSetupStatus(): Promise<SetupStatus> {
    return (await this.ds.getSetupStatus()).toEntity()
  }
}

export const setupQueryRepository: SetupQueryRepository = new SetupQueryRepositoryImpl()
