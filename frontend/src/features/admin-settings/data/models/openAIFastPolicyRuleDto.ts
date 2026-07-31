import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpenAIFastPolicyRule } from '@/features/admin-settings/domain/models/openAIFastPolicyRule'

export class OpenAIFastPolicyRuleDto {
  @Expose({ name: 'service_tier' }) @Transform(({ value }) => value ?? 'all') serviceTier!: 'all' | 'priority' | 'flex'
  @Expose() @Transform(({ value }) => value ?? 'pass') action!: 'pass' | 'filter' | 'block' | 'force_priority'
  @Expose() @Transform(({ value }) => value ?? 'all') scope!: 'all' | 'oauth' | 'apikey' | 'bedrock'
  @Expose({ name: 'user_ids' }) userIds?: number[]
  @Expose({ name: 'error_message' }) errorMessage?: string
  @Expose({ name: 'model_whitelist' }) modelWhitelist?: string[]
  @Expose({ name: 'fallback_action' }) fallbackAction?: 'pass' | 'filter' | 'block' | 'force_priority'
  @Expose({ name: 'fallback_error_message' }) fallbackErrorMessage?: string

  static fromJson(json: unknown): OpenAIFastPolicyRuleDto {
    return plainToInstance(OpenAIFastPolicyRuleDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpenAIFastPolicyRule {
    const e = new OpenAIFastPolicyRule()
    e.serviceTier = this.serviceTier
    e.action = this.action
    e.scope = this.scope
    e.userIds = this.userIds
    e.errorMessage = this.errorMessage
    e.modelWhitelist = this.modelWhitelist
    e.fallbackAction = this.fallbackAction
    e.fallbackErrorMessage = this.fallbackErrorMessage
    return e
  }
}
