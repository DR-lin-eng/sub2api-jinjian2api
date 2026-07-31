import type { InstallResponse } from '@/features/setup/domain/models/installResponse'
import type { TestDatabaseRequest } from '@/features/setup/data/requests_models/testDatabaseRequest'
import type { TestRedisRequest } from '@/features/setup/data/requests_models/testRedisRequest'
import type { InstallRequest } from '@/features/setup/data/requests_models/installRequest'

export interface SetupActionRepository {
  testDatabase(req: TestDatabaseRequest): Promise<void>
  testRedis(req: TestRedisRequest): Promise<void>
  install(req: InstallRequest): Promise<InstallResponse>
}
