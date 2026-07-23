import type { ApiKey } from '@/features/keys/domain/models/apiKey'
import type { CreateApiKeyRequest } from '@/features/keys/data/requests_models/createApiKeyRequest'
import type { UpdateApiKeyRequest } from '@/features/keys/data/requests_models/updateApiKeyRequest'

export interface KeysActionRepository {
  create(req: CreateApiKeyRequest): Promise<ApiKey>
  update(id: number, req: UpdateApiKeyRequest): Promise<ApiKey>
  deleteKey(id: number): Promise<{ message: string }>
  toggleStatus(id: number, status: 'active' | 'inactive'): Promise<ApiKey>
}
