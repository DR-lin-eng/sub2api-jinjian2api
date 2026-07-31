import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpenAIRateLimit } from '@/features/admin-accounts/domain/models/openAIRateLimit'
import { OpenAIRateLimitWindowDto } from './openAIRateLimitWindowDto'

export class OpenAIRateLimitDto {
  @Expose() @Transform(({ value }) => value ?? false) allowed!: boolean
  @Expose({ name: 'limit_reached' }) @Transform(({ value }) => value ?? false) limitReached!: boolean
  @Expose({ name: 'primary_window' }) @Type(() => OpenAIRateLimitWindowDto) primaryWindow?: OpenAIRateLimitWindowDto
  @Expose({ name: 'secondary_window' }) @Type(() => OpenAIRateLimitWindowDto) secondaryWindow?: OpenAIRateLimitWindowDto

  static fromJson(json: unknown): OpenAIRateLimitDto {
    return plainToInstance(OpenAIRateLimitDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpenAIRateLimit {
    const e = new OpenAIRateLimit()
    e.allowed = this.allowed
    e.limitReached = this.limitReached
    e.primaryWindow = this.primaryWindow?.toEntity()
    e.secondaryWindow = this.secondaryWindow?.toEntity()
    return e
  }
}
