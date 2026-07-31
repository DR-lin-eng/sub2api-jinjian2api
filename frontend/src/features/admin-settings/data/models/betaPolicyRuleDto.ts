import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { BetaPolicyRule } from '@/features/admin-settings/domain/models/betaPolicyRule'

export class BetaPolicyRuleDto {
  @Expose({ name: 'beta_token' }) @Transform(({ value }) => value ?? '') betaToken!: string
  @Expose() @Transform(({ value }) => value ?? 'pass') action!: 'pass' | 'filter' | 'block'
  @Expose() @Transform(({ value }) => value ?? 'all') scope!: 'all' | 'oauth' | 'apikey' | 'bedrock'
  @Expose({ name: 'error_message' }) errorMessage?: string
  @Expose({ name: 'model_whitelist' }) modelWhitelist?: string[]
  @Expose({ name: 'fallback_action' }) fallbackAction?: 'pass' | 'filter' | 'block'
  @Expose({ name: 'fallback_error_message' }) fallbackErrorMessage?: string

  static fromJson(json: unknown): BetaPolicyRuleDto {
    return plainToInstance(BetaPolicyRuleDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BetaPolicyRule {
    const e = new BetaPolicyRule()
    e.betaToken = this.betaToken
    e.action = this.action
    e.scope = this.scope
    e.errorMessage = this.errorMessage
    e.modelWhitelist = this.modelWhitelist
    e.fallbackAction = this.fallbackAction
    e.fallbackErrorMessage = this.fallbackErrorMessage
    return e
  }
}
