import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UserAttributeValue } from '@/features/admin-users/domain/models/userAttributeValue'

export class UserAttributeValueDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose({ name: 'user_id' })
  @Transform(({ value }) => value ?? 0)
  userId!: number

  @Expose({ name: 'attribute_id' })
  @Transform(({ value }) => value ?? 0)
  attributeId!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  value!: string

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => value ?? '')
  updatedAt!: string

  static fromJson(json: unknown): UserAttributeValueDto {
    return plainToInstance(UserAttributeValueDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserAttributeValue {
    const entity = new UserAttributeValue()
    entity.id = this.id
    entity.userId = this.userId
    entity.attributeId = this.attributeId
    entity.value = this.value
    entity.createdAt = this.createdAt
    entity.updatedAt = this.updatedAt
    return entity
  }
}
