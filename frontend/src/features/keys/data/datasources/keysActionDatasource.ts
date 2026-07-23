/**
 * Keys Action Datasource — POST/PUT/DELETE.
 * Accepts requests_models (snake_case) directly, returns Dto instances (via Dto.fromJson).
 */
import { apiClient } from '@/core/networks/client'
import { ApiKeyDto } from '@/features/keys/data/models/apiKeyDto'
import type { CreateApiKeyRequest } from '@/features/keys/data/requests_models/createApiKeyRequest'
import type { UpdateApiKeyRequest } from '@/features/keys/data/requests_models/updateApiKeyRequest'

export class KeysActionDatasource {
  async create(req: CreateApiKeyRequest): Promise<ApiKeyDto> {
    const { data } = await apiClient.post<unknown>('/keys', req)
    return ApiKeyDto.fromJson(data)
  }

  async update(id: number, req: UpdateApiKeyRequest): Promise<ApiKeyDto> {
    const { data } = await apiClient.put<unknown>(`/keys/${id}`, req)
    return ApiKeyDto.fromJson(data)
  }

  async deleteKey(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/keys/${id}`)
    return data
  }

  async toggleStatus(id: number, status: 'active' | 'inactive'): Promise<ApiKeyDto> {
    return this.update(id, { status })
  }
}

export const keysActionDatasource = new KeysActionDatasource()
