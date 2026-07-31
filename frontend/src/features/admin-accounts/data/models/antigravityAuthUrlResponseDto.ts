import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AntigravityAuthUrlResponse } from '@/features/admin-accounts/domain/models/antigravityAuthUrlResponse'

export class AntigravityAuthUrlResponseDto {
  @Expose({ name: 'auth_url' }) @Transform(({ value }) => value ?? '') authUrl!: string
  @Expose({ name: 'session_id' }) @Transform(({ value }) => value ?? '') sessionId!: string
  @Expose() @Transform(({ value }) => value ?? '') state!: string

  static fromJson(json: unknown): AntigravityAuthUrlResponseDto {
    return plainToInstance(AntigravityAuthUrlResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AntigravityAuthUrlResponse {
    const e = new AntigravityAuthUrlResponse()
    e.authUrl = this.authUrl
    e.sessionId = this.sessionId
    e.state = this.state
    return e
  }
}
