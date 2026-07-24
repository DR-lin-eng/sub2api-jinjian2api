import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { LocalCaptchaChallenge } from '@/features/auth/domain/models/localCaptchaChallenge'

export class LocalCaptchaChallengeDto {
  @Expose({ name: 'captcha_id' })
  @Transform(({ value }) => value ?? '')
  captchaId!: string

  @Expose({ name: 'image_data' })
  @Transform(({ value }) => value ?? '')
  imageData!: string

  @Expose({ name: 'expires_in' })
  @Transform(({ value }) => value ?? 0)
  expiresIn!: number

  static fromJson(json: unknown): LocalCaptchaChallengeDto {
    return plainToInstance(LocalCaptchaChallengeDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): LocalCaptchaChallenge {
    const e = new LocalCaptchaChallenge()
    e.captchaId = this.captchaId
    e.imageData = this.imageData
    e.expiresIn = this.expiresIn
    return e
  }
}
