import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpenAIQuotaResetCredit } from '@/features/admin-accounts/domain/models/openAIQuotaResetCredit'

export class OpenAIQuotaResetCreditDto {
  @Expose() @Transform(({ value }) => value ?? '') id!: string
  @Expose({ name: 'reset_type' }) @Transform(({ value }) => value ?? '') resetType!: string
  @Expose() @Transform(({ value }) => value ?? '') status!: string
  @Expose({ name: 'granted_at' }) @Transform(({ value }) => value ?? '') grantedAt!: string
  @Expose({ name: 'expires_at' }) @Transform(({ value }) => value ?? '') expiresAt!: string
  @Expose({ name: 'redeem_started_at' }) @Transform(({ value }) => value ?? '') redeemStartedAt!: string
  @Expose({ name: 'redeemed_at' }) @Transform(({ value }) => value ?? '') redeemedAt!: string

  static fromJson(json: unknown): OpenAIQuotaResetCreditDto {
    return plainToInstance(OpenAIQuotaResetCreditDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpenAIQuotaResetCredit {
    const e = new OpenAIQuotaResetCredit()
    e.id = this.id
    e.resetType = this.resetType
    e.status = this.status
    e.grantedAt = this.grantedAt
    e.expiresAt = this.expiresAt
    e.redeemStartedAt = this.redeemStartedAt
    e.redeemedAt = this.redeemedAt
    return e
  }
}
