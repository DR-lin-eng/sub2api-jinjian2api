import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { WebSearchProviderConfig } from '@/features/admin-settings/domain/models/webSearchProviderConfig'

export class WebSearchProviderConfigDto {
  @Expose() @Transform(({ value }) => value ?? 'brave') type!: 'brave' | 'tavily'
  @Expose({ name: 'api_key' }) @Transform(({ value }) => value ?? '') apiKey!: string
  @Expose({ name: 'api_key_configured' }) @Transform(({ value }) => value ?? false) apiKeyConfigured!: boolean
  @Expose({ name: 'quota_limit' }) @Transform(({ value }) => value ?? null) quotaLimit!: number | null
  @Expose({ name: 'subscribed_at' }) @Transform(({ value }) => value ?? null) subscribedAt!: number | null
  @Expose({ name: 'quota_used' }) quotaUsed?: number
  @Expose({ name: 'proxy_id' }) @Transform(({ value }) => value ?? null) proxyId!: number | null
  @Expose({ name: 'expires_at' }) @Transform(({ value }) => value ?? null) expiresAt!: number | null

  static fromJson(json: unknown): WebSearchProviderConfigDto {
    return plainToInstance(WebSearchProviderConfigDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): WebSearchProviderConfig {
    const e = new WebSearchProviderConfig()
    e.type = this.type
    e.apiKey = this.apiKey
    e.apiKeyConfigured = this.apiKeyConfigured
    e.quotaLimit = this.quotaLimit
    e.subscribedAt = this.subscribedAt
    e.quotaUsed = this.quotaUsed
    e.proxyId = this.proxyId
    e.expiresAt = this.expiresAt
    return e
  }
}
