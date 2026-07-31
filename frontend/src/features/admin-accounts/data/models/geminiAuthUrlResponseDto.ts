import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { GeminiAuthUrlResponse } from '@/features/admin-accounts/domain/models/geminiAuthUrlResponse'

export class GeminiAuthUrlResponseDto {
  @Expose({ name: 'auth_url' }) @Transform(({ value }) => value ?? '') authUrl!: string
  @Expose({ name: 'session_id' }) @Transform(({ value }) => value ?? '') sessionId!: string
  @Expose() @Transform(({ value }) => value ?? '') state!: string

  static fromJson(json: unknown): GeminiAuthUrlResponseDto {
    return plainToInstance(GeminiAuthUrlResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GeminiAuthUrlResponse {
    const e = new GeminiAuthUrlResponse()
    e.authUrl = this.authUrl
    e.sessionId = this.sessionId
    e.state = this.state
    return e
  }
}
