import { apiClient } from '@/core/networks/client'
import { UserAttributeDefinitionDto } from '@/features/admin-users/data/models/userAttributeDefinitionDto'
import type { CreateUserAttributeRequest } from '@/features/admin-users/data/requests_models/createUserAttributeRequest'
import type { UpdateUserAttributeRequest } from '@/features/admin-users/data/requests_models/updateUserAttributeRequest'
import type { ReorderUserAttributesRequest } from '@/features/admin-users/data/requests_models/reorderUserAttributesRequest'
import type { UpdateUserAttributeValuesRequest } from '@/features/admin-users/data/requests_models/updateUserAttributeValuesRequest'

export class UserAttributesActionDatasource {
  async createDefinition(req: CreateUserAttributeRequest): Promise<UserAttributeDefinitionDto> {
    const { data } = await apiClient.post<unknown>('/admin/user-attributes', req)
    return UserAttributeDefinitionDto.fromJson(data)
  }

  async updateDefinition(id: number, req: UpdateUserAttributeRequest): Promise<UserAttributeDefinitionDto> {
    const { data } = await apiClient.put<unknown>(`/admin/user-attributes/${id}`, req)
    return UserAttributeDefinitionDto.fromJson(data)
  }

  async deleteDefinition(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/user-attributes/${id}`)
    return data
  }

  async reorderDefinitions(req: ReorderUserAttributesRequest): Promise<{ message: string }> {
    const { data } = await apiClient.put<{ message: string }>('/admin/user-attributes/reorder', req)
    return data
  }

  async updateUserAttributeValues(userId: number, req: UpdateUserAttributeValuesRequest): Promise<{ message: string }> {
    const { data } = await apiClient.put<{ message: string }>(
      `/admin/users/${userId}/attributes`,
      req
    )
    return data
  }
}

export const userAttributesActionDatasource = new UserAttributesActionDatasource()
