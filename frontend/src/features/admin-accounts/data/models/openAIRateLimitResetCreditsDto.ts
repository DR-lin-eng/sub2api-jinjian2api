import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpenAIRateLimitResetCredits } from '@/features/admin-accounts/domain/models/openAIRateLimitResetCredits'
import { OpenAIRateLimitResetCreditDetailDto } from './openAIRateLimitResetCreditDetailDto'

export class OpenAIRateLimitResetCreditsDto {
  @Expose({ name: 'available_count' }) @Transform(({ value }) => value ?? 0) availableCount!: number
  @Expose() @Type(() => OpenAIRateLimitResetCreditDetailDto) @Transform(({ value }) => value ?? []) credits!: OpenAIRateLimitResetCreditDetailDto[]

  static fromJson(json: unknown): OpenAIRateLimitResetCreditsDto {
    return plainToInstance(OpenAIRateLimitResetCreditsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpenAIRateLimitResetCredits {
    const e = new OpenAIRateLimitResetCredits()
    e.availableCount = this.availableCount
    e.credits = this.credits.map(d => d.toEntity())
    return e
  }
}
