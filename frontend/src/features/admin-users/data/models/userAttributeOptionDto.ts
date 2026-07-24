import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UserAttributeOption } from '@/features/admin-users/domain/models/userAttributeOption'

export class UserAttributeOptionDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  value!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  label!: string

  static fromJson(json: unknown): UserAttributeOptionDto {
    return plainToInstance(UserAttributeOptionDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserAttributeOption {
    const entity = new UserAttributeOption()
    entity.value = this.value
    entity.label = this.label
    return entity
  }
}
