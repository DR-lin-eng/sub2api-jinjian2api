import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { GrokAuthUrlResponse } from '@/features/admin-accounts/domain/models/grokAuthUrlResponse'

export class GrokAuthUrlResponseDto {
  @Expose({ name: 'auth_url' }) @Transform(({ value }) => value ?? '') authUrl!: string
  @Expose({ name: 'session_id' }) @Transform(({ value }) => value ?? '') sessionId!: string
  @Expose() @Transform(({ value }) => value ?? '') state!: string

  static fromJson(json: unknown): GrokAuthUrlResponseDto {
    return plainToInstance(GrokAuthUrlResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): GrokAuthUrlResponse {
    const e = new GrokAuthUrlResponse()
    e.authUrl = this.authUrl
    e.sessionId = this.sessionId
    e.state = this.state
    return e
  }
}
