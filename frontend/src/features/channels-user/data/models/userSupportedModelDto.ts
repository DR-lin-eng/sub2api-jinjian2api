import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { UserSupportedModel } from '@/features/channels-user/domain/models/userSupportedModel'
import { UserSupportedModelPricingDto } from './userSupportedModelPricingDto'

export class UserSupportedModelDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  platform!: string

  @Expose()
  @Transform(({ value }) => value ?? null)
  @Type(() => UserSupportedModelPricingDto)
  pricing!: UserSupportedModelPricingDto | null

  static fromJson(json: unknown): UserSupportedModelDto {
    return plainToInstance(UserSupportedModelDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserSupportedModel {
    const e = new UserSupportedModel()
    e.name = this.name
    e.platform = this.platform
    e.pricing = this.pricing ? this.pricing.toEntity() : null
    return e
  }
}
