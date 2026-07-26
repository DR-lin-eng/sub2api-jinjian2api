import { keysActionDatasource } from '@/features/keys/data/datasources/keysActionDatasource'
import type { ApiKey } from '@/core/models/domain/apiKey'
import type { CreateApiKeyRequest } from '@/features/keys/data/requests_models/createApiKeyRequest'
import type { UpdateApiKeyRequest } from '@/features/keys/data/requests_models/updateApiKeyRequest'
import type { KeysActionRepository } from '@/features/keys/domain/repositories/keysActionRepository'

export class KeysActionRepositoryImpl implements KeysActionRepository {
  private readonly ds = keysActionDatasource

  create = async (req: CreateApiKeyRequest) : Promise<ApiKey>  => {
    return (await this.ds.create(req)).toEntity()
  }

  update = async (id: number, req: UpdateApiKeyRequest) : Promise<ApiKey>  => {
    return (await this.ds.update(id, req)).toEntity()
  }

  deleteKey = async (id: number) : Promise<{ message: string }>  => {
    return this.ds.deleteKey(id)
  }

  toggleStatus = async (id: number, status: 'active' | 'inactive') : Promise<ApiKey>  => {
    return (await this.ds.toggleStatus(id, status)).toEntity()
  }
}

export const keysActionRepository: KeysActionRepository = new KeysActionRepositoryImpl()
