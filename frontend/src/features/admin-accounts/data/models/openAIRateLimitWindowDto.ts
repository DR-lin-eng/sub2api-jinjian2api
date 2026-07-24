import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpenAIRateLimitWindow } from '@/features/admin-accounts/domain/models/openAIRateLimitWindow'

export class OpenAIRateLimitWindowDto {
  @Expose({ name: 'used_percent' }) @Transform(({ value }) => value ?? 0) usedPercent!: number
  @Expose({ name: 'limit_window_seconds' }) @Transform(({ value }) => value ?? 0) limitWindowSeconds!: number
  @Expose({ name: 'reset_after_seconds' }) @Transform(({ value }) => value ?? 0) resetAfterSeconds!: number
  @Expose({ name: 'reset_at' }) @Transform(({ value }) => value ?? 0) resetAt!: number

  static fromJson(json: unknown): OpenAIRateLimitWindowDto {
    return plainToInstance(OpenAIRateLimitWindowDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpenAIRateLimitWindow {
    const e = new OpenAIRateLimitWindow()
    e.usedPercent = this.usedPercent
    e.limitWindowSeconds = this.limitWindowSeconds
    e.resetAfterSeconds = this.resetAfterSeconds
    e.resetAt = this.resetAt
    return e
  }
}
