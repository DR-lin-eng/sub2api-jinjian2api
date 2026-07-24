import { apiClient } from '@/core/networks/client'
import { UserAttributeDefinitionDto } from '@/features/admin-users/data/models/userAttributeDefinitionDto'
import { UserAttributeValueDto } from '@/features/admin-users/data/models/userAttributeValueDto'

export class UserAttributesQueryDatasource {
  async listDefinitions(): Promise<UserAttributeDefinitionDto[]> {
    const { data } = await apiClient.get<unknown[]>('/admin/user-attributes')
    return (data ?? []).map(item => UserAttributeDefinitionDto.fromJson(item))
  }

  async listEnabledDefinitions(): Promise<UserAttributeDefinitionDto[]> {
    const { data } = await apiClient.get<unknown[]>('/admin/user-attributes', {
      params: { enabled: true },
    })
    return (data ?? []).map(item => UserAttributeDefinitionDto.fromJson(item))
  }

  async getUserAttributeValues(userId: number): Promise<UserAttributeValueDto[]> {
    const { data } = await apiClient.get<unknown[]>(`/admin/users/${userId}/attributes`)
    return (data ?? []).map(item => UserAttributeValueDto.fromJson(item))
  }

  async getBatchUserAttributes(userIds: number[]): Promise<Record<number, Record<number, string>>> {
    const { data } = await apiClient.post<{ attributes: Record<number, Record<number, string>> }>(
      '/admin/user-attributes/batch',
      { user_ids: userIds }
    )
    return data.attributes ?? {}
  }
}

export const userAttributesQueryDatasource = new UserAttributesQueryDatasource()
