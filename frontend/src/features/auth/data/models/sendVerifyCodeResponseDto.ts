import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { SendVerifyCodeResponse } from '@/features/auth/domain/models/sendVerifyCodeResponse'

export class SendVerifyCodeResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  message!: string

  @Expose()
  @Transform(({ value }) => value ?? 0)
  countdown!: number

  static fromJson(json: unknown): SendVerifyCodeResponseDto {
    return plainToInstance(SendVerifyCodeResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): SendVerifyCodeResponse {
    const e = new SendVerifyCodeResponse()
    e.message = this.message
    e.countdown = this.countdown
    return e
  }
}
