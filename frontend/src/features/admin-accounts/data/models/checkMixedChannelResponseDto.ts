import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { CheckMixedChannelResponse } from '@/features/admin-accounts/domain/models/checkMixedChannelResponse'

export class CheckMixedChannelResponseDto {
  @Expose({ name: 'has_risk' }) @Transform(({ value }) => value ?? false) hasRisk!: boolean
  @Expose() @Transform(({ value }) => value ?? '') error!: string
  @Expose() @Transform(({ value }) => value ?? '') message!: string
  @Expose() details?: {
    group_id: number
    group_name: string
    current_platform: string
    other_platform: string
  }

  static fromJson(json: unknown): CheckMixedChannelResponseDto {
    return plainToInstance(CheckMixedChannelResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): CheckMixedChannelResponse {
    const e = new CheckMixedChannelResponse()
    e.hasRisk = this.hasRisk
    e.error = this.error
    e.message = this.message
    e.details = this.details
      ? {
          groupId: this.details.group_id,
          groupName: this.details.group_name,
          currentPlatform: this.details.current_platform,
          otherPlatform: this.details.other_platform,
        }
      : undefined
    return e
  }
}
