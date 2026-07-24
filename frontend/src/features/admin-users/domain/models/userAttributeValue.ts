export class UserAttributeValue {
  id!: number
  userId!: number
  attributeId!: number
  value!: string
  createdAt!: string
  updatedAt!: string
}

export type UserAttributeValuesMap = Record<number, string>
