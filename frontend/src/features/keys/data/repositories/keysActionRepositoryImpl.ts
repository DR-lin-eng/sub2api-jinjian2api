import { keysActionDatasource } from '@/features/keys/data/datasources/keysActionDatasource'
import type { ApiKey } from '@/features/keys/domain/models/apiKey'
import type { CreateApiKeyRequest } from '@/features/keys/data/requests_models/createApiKeyRequest'
import type { UpdateApiKeyRequest } from '@/features/keys/data/requests_models/updateApiKeyRequest'
import type { KeysActionRepository } from '@/features/keys/domain/repositories/keysActionRepository'

export class KeysActionRepositoryImpl implements KeysActionRepository {
  private readonly ds = keysActionDatasource

  async create(req: CreateApiKeyRequest): Promise<ApiKey> {
    return (await this.ds.create(req)).toEntity()
  }

  async update(id: number, req: UpdateApiKeyRequest): Promise<ApiKey> {
    return (await this.ds.update(id, req)).toEntity()
  }

  async deleteKey(id: number): Promise<{ message: string }> {
    return this.ds.deleteKey(id)
  }

  async toggleStatus(id: number, status: 'active' | 'inactive'): Promise<ApiKey> {
    return (await this.ds.toggleStatus(id, status)).toEntity()
  }
}

export const keysActionRepository: KeysActionRepository = new KeysActionRepositoryImpl()
