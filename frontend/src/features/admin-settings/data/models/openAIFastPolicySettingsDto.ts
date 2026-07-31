import 'reflect-metadata'
import { Expose, Type, plainToInstance } from 'class-transformer'
import { OpenAIFastPolicySettings } from '@/features/admin-settings/domain/models/openAIFastPolicySettings'
import { OpenAIFastPolicyRuleDto } from './openAIFastPolicyRuleDto'

export class OpenAIFastPolicySettingsDto {
  @Expose()
  @Type(() => OpenAIFastPolicyRuleDto)
  rules!: OpenAIFastPolicyRuleDto[]

  static fromJson(json: unknown): OpenAIFastPolicySettingsDto {
    return plainToInstance(OpenAIFastPolicySettingsDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpenAIFastPolicySettings {
    const e = new OpenAIFastPolicySettings()
    e.rules = (this.rules ?? []).map(r => r.toEntity())
    return e
  }
}
