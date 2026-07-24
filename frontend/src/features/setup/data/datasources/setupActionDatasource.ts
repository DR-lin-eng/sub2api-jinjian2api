import axios from 'axios'
import { buildGatewayUrl } from '@/core/networks/url'
import { InstallResponseDto } from '@/features/setup/data/models/installResponseDto'
import type { TestDatabaseRequest } from '@/features/setup/data/requests_models/testDatabaseRequest'
import type { TestRedisRequest } from '@/features/setup/data/requests_models/testRedisRequest'
import type { InstallRequest } from '@/features/setup/data/requests_models/installRequest'

const setupClient = axios.create({
  baseURL: buildGatewayUrl('/').replace(/\/+$/, ''),
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

export class SetupActionDatasource {
  async testDatabase(req: TestDatabaseRequest): Promise<void> {
    await setupClient.post('/setup/test-db', req)
  }

  async testRedis(req: TestRedisRequest): Promise<void> {
    await setupClient.post('/setup/test-redis', req)
  }

  async install(req: InstallRequest): Promise<InstallResponseDto> {
    const { data } = await setupClient.post<{ data: unknown }>('/setup/install', req)
    return InstallResponseDto.fromJson(data.data)
  }
}

export const setupActionDatasource = new SetupActionDatasource()
