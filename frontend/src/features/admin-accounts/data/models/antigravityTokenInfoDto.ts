import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AntigravityTokenInfo } from '@/features/admin-accounts/domain/models/antigravityTokenInfo'

export class AntigravityTokenInfoDto {
  @Expose({ name: 'access_token' }) @Transform(({ value }) => value ?? '') accessToken!: string
  @Expose({ name: 'refresh_token' }) @Transform(({ value }) => value ?? '') refreshToken!: string
  @Expose({ name: 'token_type' }) @Transform(({ value }) => value ?? '') tokenType!: string
  @Expose({ name: 'expires_at' }) @Transform(({ value }) => value ?? 0) expiresAt!: number
  @Expose({ name: 'expires_in' }) @Transform(({ value }) => value ?? 0) expiresIn!: number
  @Expose({ name: 'project_id' }) @Transform(({ value }) => value ?? '') projectId!: string
  @Expose() @Transform(({ value }) => value ?? '') email!: string

  static fromJson(json: unknown): AntigravityTokenInfoDto {
    return plainToInstance(AntigravityTokenInfoDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AntigravityTokenInfo {
    const e = new AntigravityTokenInfo()
    e.accessToken = this.accessToken
    e.refreshToken = this.refreshToken
    e.tokenType = this.tokenType
    e.expiresAt = this.expiresAt
    e.expiresIn = this.expiresIn
    e.projectId = this.projectId
    e.email = this.email
    return e
  }
}
