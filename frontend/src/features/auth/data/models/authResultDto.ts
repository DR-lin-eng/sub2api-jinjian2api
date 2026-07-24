import 'reflect-metadata'
import { Expose, Transform, plainToInstance, Type } from 'class-transformer'
import { AuthResult } from '@/features/auth/domain/models/authResult'
import { UserDto } from '@/core/models/data/userDto'

export class AuthResultDto {
  @Expose({ name: 'access_token' })
  @Transform(({ value }) => value ?? '')
  accessToken!: string

  @Expose({ name: 'token_type' })
  @Transform(({ value }) => value ?? 'bearer')
  tokenType!: string

  @Expose()
  @Type(() => UserDto)
  user!: UserDto

  @Expose({ name: 'run_mode' })
  @Transform(({ value }) => value ?? 'standard')
  runMode!: 'standard' | 'simple'

  @Expose({ name: 'refresh_token' })
  @Transform(({ value }) => value ?? '')
  refreshToken!: string

  @Expose({ name: 'expires_in' })
  @Transform(({ value }) => value ?? 0)
  expiresIn!: number

  static fromJson(json: unknown): AuthResultDto {
    return plainToInstance(AuthResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AuthResult {
    const e = new AuthResult()
    e.accessToken = this.accessToken
    e.tokenType = this.tokenType
    e.user = this.user.toEntity()
    e.runMode = this.runMode
    e.refreshToken = this.refreshToken
    e.expiresIn = this.expiresIn
    return e
  }
}
