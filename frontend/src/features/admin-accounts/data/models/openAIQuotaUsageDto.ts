import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpenAIQuotaUsage } from '@/features/admin-accounts/domain/models/openAIQuotaUsage'
import { OpenAIRateLimitDto } from './openAIRateLimitDto'
import { OpenAIAdditionalRateLimitDto } from './openAIAdditionalRateLimitDto'
import { OpenAIRateLimitResetCreditsDto } from './openAIRateLimitResetCreditsDto'

export class OpenAIQuotaUsageDto {
  @Expose({ name: 'user_id' }) @Transform(({ value }) => value ?? '') userId!: string
  @Expose({ name: 'account_id' }) @Transform(({ value }) => value ?? '') accountId!: string
  @Expose() @Transform(({ value }) => value ?? '') email!: string
  @Expose({ name: 'plan_type' }) @Transform(({ value }) => value ?? '') planType!: string
  @Expose({ name: 'rate_limit' }) @Type(() => OpenAIRateLimitDto) rateLimit?: OpenAIRateLimitDto
  @Expose({ name: 'additional_rate_limits' }) @Type(() => OpenAIAdditionalRateLimitDto) @Transform(({ value }) => value ?? []) additionalRateLimits!: OpenAIAdditionalRateLimitDto[]
  @Expose({ name: 'rate_limit_reset_credits' }) @Type(() => OpenAIRateLimitResetCreditsDto) rateLimitResetCredits?: OpenAIRateLimitResetCreditsDto
  @Expose({ name: 'fetched_at' }) @Transform(({ value }) => value ?? 0) fetchedAt!: number

  static fromJson(json: unknown): OpenAIQuotaUsageDto {
    return plainToInstance(OpenAIQuotaUsageDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpenAIQuotaUsage {
    const e = new OpenAIQuotaUsage()
    e.userId = this.userId
    e.accountId = this.accountId
    e.email = this.email
    e.planType = this.planType
    e.rateLimit = this.rateLimit?.toEntity()
    e.additionalRateLimits = this.additionalRateLimits.map(d => d.toEntity())
    e.rateLimitResetCredits = this.rateLimitResetCredits?.toEntity()
    e.fetchedAt = this.fetchedAt
    return e
  }
}
