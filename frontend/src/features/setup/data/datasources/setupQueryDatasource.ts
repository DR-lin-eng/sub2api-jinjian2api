import axios from 'axios'
import { buildGatewayUrl } from '@/core/networks/url'
import { SetupStatusDto } from '@/features/setup/data/models/setupStatusDto'

const setupClient = axios.create({
  baseURL: buildGatewayUrl('/').replace(/\/+$/, ''),
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

export class SetupQueryDatasource {
  async getSetupStatus(): Promise<SetupStatusDto> {
    const { data } = await setupClient.get<{ data: unknown }>('/setup/status')
    return SetupStatusDto.fromJson(data.data)
  }
}

export const setupQueryDatasource = new SetupQueryDatasource()
