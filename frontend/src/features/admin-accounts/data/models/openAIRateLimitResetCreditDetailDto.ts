import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpenAIRateLimitResetCreditDetail } from '@/features/admin-accounts/domain/models/openAIRateLimitResetCreditDetail'

export class OpenAIRateLimitResetCreditDetailDto {
  @Expose({ name: 'expires_at' }) @Transform(({ value }) => value ?? '') expiresAt!: string

  static fromJson(json: unknown): OpenAIRateLimitResetCreditDetailDto {
    return plainToInstance(OpenAIRateLimitResetCreditDetailDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpenAIRateLimitResetCreditDetail {
    const e = new OpenAIRateLimitResetCreditDetail()
    e.expiresAt = this.expiresAt
    return e
  }
}
