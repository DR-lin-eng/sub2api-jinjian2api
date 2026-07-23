import type {
  UserAttributeType, UserAttributeOption, UserAttributeDefinition,
} from '@/features/admin-users/domain/models/userAttributes'

interface UserAttributeValidationDto {
  min_length?: number
  max_length?: number
  min?: number
  max?: number
  pattern?: string
  message?: string
}

export interface UserAttributeDefinitionDto {
  id: number
  key: string
  name: string
  description: string
  type: UserAttributeType
  options: UserAttributeOption[]
  required: boolean
  validation: UserAttributeValidationDto
  placeholder: string
  display_order: number
  enabled: boolean
  created_at: string
  updated_at: string
}

function toValidationEntity(dto: UserAttributeValidationDto) {
  return {
    minLength: dto.min_length,
    maxLength: dto.max_length,
    min: dto.min,
    max: dto.max,
    pattern: dto.pattern,
    message: dto.message,
  }
}

export function toEntity(dto: UserAttributeDefinitionDto): UserAttributeDefinition {
  return {
    id: dto.id ?? 0,
    key: dto.key ?? '',
    name: dto.name ?? '',
    description: dto.description ?? '',
    type: dto.type,
    options: dto.options ?? [],
    required: dto.required ?? false,
    validation: toValidationEntity(dto.validation ?? {}),
    placeholder: dto.placeholder ?? '',
    displayOrder: dto.display_order ?? 0,
    enabled: dto.enabled ?? true,
    createdAt: dto.created_at ?? '',
    updatedAt: dto.updated_at ?? '',
  }
}
