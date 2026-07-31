import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { GeminiOAuthCapabilities } from '@/features/admin-accounts/domain/models/geminiOAuthCapabilities'

export class GeminiOAuthCapabilitiesDto {
  @Expose({ name: 'ai_studio_oauth_enabled' }) @Transform(({ value }) => value ?? false) aiStudioOauthEnabled!: boolean
  @Expose({ name: 'required_redirect_uris' }) @Transform(({ value }) => value ?? []) requiredRedirectUris!: string[]

  static fromJson(json: unknown): GeminiOAuthCapabilitiesDto {
    return plainToInstance(GeminiOAuthCapabilitiesDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GeminiOAuthCapabilities {
    const e = new GeminiOAuthCapabilities()
    e.aiStudioOauthEnabled = this.aiStudioOauthEnabled
    e.requiredRedirectUris = this.requiredRedirectUris
    return e
  }
}
