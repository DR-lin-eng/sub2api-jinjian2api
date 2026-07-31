import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { GrokTokenInfo } from '@/features/admin-accounts/domain/models/grokTokenInfo'

export class GrokTokenInfoDto {
  @Expose({ name: 'access_token' }) @Transform(({ value }) => value ?? '') accessToken!: string
  @Expose({ name: 'refresh_token' }) @Transform(({ value }) => value ?? '') refreshToken!: string
  @Expose({ name: 'token_type' }) @Transform(({ value }) => value ?? '') tokenType!: string
  @Expose({ name: 'id_token' }) @Transform(({ value }) => value ?? '') idToken!: string
  @Expose({ name: 'expires_at' }) @Transform(({ value }) => value ?? 0) expiresAt!: number
  @Expose({ name: 'expires_in' }) @Transform(({ value }) => value ?? 0) expiresIn!: number
  @Expose() @Transform(({ value }) => value ?? '') scope!: string
  @Expose({ name: 'client_id' }) @Transform(({ value }) => value ?? '') clientId!: string
  @Expose() @Transform(({ value }) => value ?? '') email!: string
  @Expose() @Transform(({ value }) => value ?? '') sub!: string
  @Expose({ name: 'team_id' }) @Transform(({ value }) => value ?? '') teamId!: string
  @Expose({ name: 'subscription_tier' }) @Transform(({ value }) => value ?? '') subscriptionTier!: string
  @Expose({ name: 'entitlement_status' }) @Transform(({ value }) => value ?? '') entitlementStatus!: string

  static fromJson(json: unknown): GrokTokenInfoDto {
    return plainToInstance(GrokTokenInfoDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GrokTokenInfo {
    const e = new GrokTokenInfo()
    e.accessToken = this.accessToken
    e.refreshToken = this.refreshToken
    e.tokenType = this.tokenType
    e.idToken = this.idToken
    e.expiresAt = this.expiresAt
    e.expiresIn = this.expiresIn
    e.scope = this.scope
    e.clientId = this.clientId
    e.email = this.email
    e.sub = this.sub
    e.teamId = this.teamId
    e.subscriptionTier = this.subscriptionTier
    e.entitlementStatus = this.entitlementStatus
    return e
  }
}
