import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UserProfileSourceContext } from '@/core/models/domain/userProfileSourceContext'

export class UserProfileSourceContextDto {
  @Expose() @Transform(({ value }) => value ?? '') provider!: string
  @Expose() @Transform(({ value }) => value ?? '') source!: string
  @Expose() @Transform(({ value }) => value ?? '') label!: string
  @Expose({ name: 'provider_label' }) @Transform(({ value }) => value ?? '') providerLabel!: string

  static fromJson(json: unknown): UserProfileSourceContextDto {
    return plainToInstance(UserProfileSourceContextDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserProfileSourceContext {
    const e = new UserProfileSourceContext()
    e.provider = this.provider
    e.source = this.source
    e.label = this.label
    e.providerLabel = this.providerLabel
    return e
  }
}
