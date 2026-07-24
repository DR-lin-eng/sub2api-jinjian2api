import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UserAttributeValidation } from '@/features/admin-users/domain/models/userAttributeValidation'

export class UserAttributeValidationDto {
  @Expose({ name: 'min_length' })
  @Transform(({ value }) => value ?? 0)
  minLength!: number

  @Expose({ name: 'max_length' })
  @Transform(({ value }) => value ?? 0)
  maxLength!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  min!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  max!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  pattern!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  message!: string

  static fromJson(json: unknown): UserAttributeValidationDto {
    return plainToInstance(UserAttributeValidationDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserAttributeValidation {
    const entity = new UserAttributeValidation()
    entity.minLength = this.minLength
    entity.maxLength = this.maxLength
    entity.min = this.min
    entity.max = this.max
    entity.pattern = this.pattern
    entity.message = this.message
    return entity
  }
}
