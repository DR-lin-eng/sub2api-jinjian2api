import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { GeminiTokenInfo } from '@/features/admin-accounts/domain/models/geminiTokenInfo'

export class GeminiTokenInfoDto {
  @Expose({ name: 'access_token' }) @Transform(({ value }) => value ?? '') accessToken!: string
  @Expose({ name: 'refresh_token' }) @Transform(({ value }) => value ?? '') refreshToken!: string
  @Expose({ name: 'token_type' }) @Transform(({ value }) => value ?? '') tokenType!: string
  @Expose() @Transform(({ value }) => value ?? '') scope!: string
  @Expose({ name: 'expires_in' }) @Transform(({ value }) => value ?? 0) expiresIn!: number
  @Expose({ name: 'expires_at' }) @Transform(({ value }) => value ?? 0) expiresAt!: number
  @Expose({ name: 'project_id' }) @Transform(({ value }) => value ?? '') projectId!: string
  @Expose({ name: 'oauth_type' }) @Transform(({ value }) => value ?? '') oauthType!: string
  @Expose({ name: 'tier_id' }) @Transform(({ value }) => value ?? '') tierId!: string
  @Expose() @Transform(({ value }) => value ?? {}) extra!: Record<string, unknown>

  static fromJson(json: unknown): GeminiTokenInfoDto {
    return plainToInstance(GeminiTokenInfoDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GeminiTokenInfo {
    const e = new GeminiTokenInfo()
    e.accessToken = this.accessToken
    e.refreshToken = this.refreshToken
    e.tokenType = this.tokenType
    e.scope = this.scope
    e.expiresIn = this.expiresIn
    e.expiresAt = this.expiresAt
    e.projectId = this.projectId
    e.oauthType = this.oauthType
    e.tierId = this.tierId
    e.extra = this.extra
    return e
  }
}
