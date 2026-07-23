import type { UserAttributeValue } from '@/features/admin-users/domain/models/userAttributes'

export interface UserAttributeValueDto {
  id: number
  user_id: number
  attribute_id: number
  value: string
  created_at: string
  updated_at: string
}

export function toEntity(dto: UserAttributeValueDto): UserAttributeValue {
  return {
    id: dto.id ?? 0,
    userId: dto.user_id ?? 0,
    attributeId: dto.attribute_id ?? 0,
    value: dto.value ?? '',
    createdAt: dto.created_at ?? '',
    updatedAt: dto.updated_at ?? '',
  }
}
