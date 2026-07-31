import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import type { UserAttributeType } from '@/features/admin-users/enums/userAttributeType'
import { UserAttributeDefinition } from '@/features/admin-users/domain/models/userAttributeDefinition'
import { UserAttributeOptionDto } from '@/features/admin-users/data/models/userAttributeOptionDto'
import { UserAttributeValidationDto } from '@/features/admin-users/data/models/userAttributeValidationDto'

export class UserAttributeDefinitionDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  key!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  description!: string

  @Expose()
  type!: UserAttributeType

  @Expose()
  @Type(() => UserAttributeOptionDto)
  @Transform(({ value }) => value ?? [])
  options!: UserAttributeOptionDto[]

  @Expose()
  @Transform(({ value }) => value ?? false)
  required!: boolean

  @Expose()
  @Type(() => UserAttributeValidationDto)
  validation!: UserAttributeValidationDto

  @Expose()
  @Transform(({ value }) => value ?? '')
  placeholder!: string

  @Expose({ name: 'display_order' })
  @Transform(({ value }) => value ?? 0)
  displayOrder!: number

  @Expose()
  @Transform(({ value }) => value ?? true)
  enabled!: boolean

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => value ?? '')
  updatedAt!: string

  static fromJson(json: unknown): UserAttributeDefinitionDto {
    return plainToInstance(UserAttributeDefinitionDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserAttributeDefinition {
    const entity = new UserAttributeDefinition()
    entity.id = this.id
    entity.key = this.key
    entity.name = this.name
    entity.description = this.description
    entity.type = this.type
    entity.options = (this.options ?? []).map(o => o.toEntity())
    entity.required = this.required
    entity.validation = this.validation ? this.validation.toEntity() : new UserAttributeValidationDto().toEntity()
    entity.placeholder = this.placeholder
    entity.displayOrder = this.displayOrder
    entity.enabled = this.enabled
    entity.createdAt = this.createdAt
    entity.updatedAt = this.updatedAt
    return entity
  }
}
