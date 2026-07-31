import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PromptAuditEndpoint } from '@/features/prompt-audit/domain/models/promptAuditEndpoint'

export class PromptAuditEndpointDto {
  @Expose() @Transform(({ value }) => value ?? '') id!: string
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose() @Transform(({ value }) => value ?? 'openai_compatible') protocol!: 'openai_compatible'
  @Expose({ name: 'base_url' }) @Transform(({ value }) => value ?? '') baseUrl!: string
  @Expose() @Transform(({ value }) => value ?? '') model!: string
  @Expose({ name: 'timeout_ms' }) @Transform(({ value }) => value ?? 3000) timeoutMs!: number
  @Expose({ name: 'input_limit' }) @Transform(({ value }) => value ?? 4000) inputLimit!: number
  @Expose() @Transform(({ value }) => value ?? true) enabled!: boolean
  @Expose({ name: 'has_token' }) @Transform(({ value }) => value ?? false) hasToken!: boolean
  @Expose({ name: 'token_status' }) @Transform(({ value }) => value ?? 'missing') tokenStatus!: string

  static fromJson(json: unknown): PromptAuditEndpointDto {
    return plainToInstance(PromptAuditEndpointDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PromptAuditEndpoint {
    const e = new PromptAuditEndpoint()
    e.id = this.id
    e.name = this.name
    e.protocol = this.protocol
    e.baseUrl = this.baseUrl
    e.model = this.model
    e.timeoutMs = this.timeoutMs
    e.inputLimit = this.inputLimit
    e.enabled = this.enabled
    e.hasToken = this.hasToken
    e.tokenStatus = this.tokenStatus
    return e
  }
}
