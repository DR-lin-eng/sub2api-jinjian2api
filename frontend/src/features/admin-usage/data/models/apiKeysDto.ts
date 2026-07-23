import type { UpdateApiKeyGroupResult } from '@/features/admin-usage/domain/models/apiKeys'
import type { ApiKey } from '@/features/keys/domain/models/apiKey'
export interface UpdateApiKeyGroupResultDto {
  api_key: ApiKey
  auto_granted_group_access: boolean
  granted_group_id?: number
  granted_group_name?: string
}

export function toEntity(dto: UpdateApiKeyGroupResultDto): UpdateApiKeyGroupResult {
  return {
    apiKeyId: dto.api_key?.id ?? 0,
    autoGrantedGroupAccess: dto.auto_granted_group_access ?? false,
    grantedGroupId: dto.granted_group_id,
    grantedGroupName: dto.granted_group_name,
  }
}

