import type { UserAttributeType } from '@/features/admin-users/enums/userAttributeType'
import type { UserAttributeOption } from '@/features/admin-users/domain/models/userAttributeOption'
import type { UserAttributeValidation } from '@/features/admin-users/domain/models/userAttributeValidation'

export class UserAttributeDefinition {
  id!: number
  key!: string
  name!: string
  description!: string
  type!: UserAttributeType
  options!: UserAttributeOption[]
  required!: boolean
  validation!: UserAttributeValidation
  placeholder!: string
  displayOrder!: number
  enabled!: boolean
  createdAt!: string
  updatedAt!: string
}
