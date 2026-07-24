import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpenAIAdditionalRateLimit } from '@/features/admin-accounts/domain/models/openAIAdditionalRateLimit'
import { OpenAIRateLimitDto } from './openAIRateLimitDto'

export class OpenAIAdditionalRateLimitDto {
  @Expose({ name: 'limit_name' }) @Transform(({ value }) => value ?? '') limitName!: string
  @Expose({ name: 'metered_feature' }) @Transform(({ value }) => value ?? '') meteredFeature!: string
  @Expose({ name: 'rate_limit' }) @Type(() => OpenAIRateLimitDto) rateLimit?: OpenAIRateLimitDto

  static fromJson(json: unknown): OpenAIAdditionalRateLimitDto {
    return plainToInstance(OpenAIAdditionalRateLimitDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpenAIAdditionalRateLimit {
    const e = new OpenAIAdditionalRateLimit()
    e.limitName = this.limitName
    e.meteredFeature = this.meteredFeature
    e.rateLimit = this.rateLimit?.toEntity()
    return e
  }
}
