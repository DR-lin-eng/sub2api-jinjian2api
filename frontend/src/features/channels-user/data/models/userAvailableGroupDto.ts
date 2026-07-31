import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UserAvailableGroup } from '@/features/channels-user/domain/models/userAvailableGroup'

export class UserAvailableGroupDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  name!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  platform!: string

  @Expose({ name: 'subscription_type' })
  @Transform(({ value }) => value ?? 'standard')
  subscriptionType!: string

  @Expose({ name: 'rate_multiplier' })
  @Transform(({ value }) => value ?? 1)
  rateMultiplier!: number

  @Expose({ name: 'peak_rate_enabled' })
  @Transform(({ value }) => value ?? false)
  peakRateEnabled!: boolean

  @Expose({ name: 'peak_start' })
  @Transform(({ value }) => value ?? '')
  peakStart!: string

  @Expose({ name: 'peak_end' })
  @Transform(({ value }) => value ?? '')
  peakEnd!: string

  @Expose({ name: 'peak_rate_multiplier' })
  @Transform(({ value }) => value ?? 1)
  peakRateMultiplier!: number

  @Expose({ name: 'is_exclusive' })
  @Transform(({ value }) => value ?? false)
  isExclusive!: boolean

  static fromJson(json: unknown): UserAvailableGroupDto {
    return plainToInstance(UserAvailableGroupDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserAvailableGroup {
    const e = new UserAvailableGroup()
    e.id = this.id
    e.name = this.name
    e.platform = this.platform
    e.subscriptionType = this.subscriptionType
    e.rateMultiplier = this.rateMultiplier
    e.peakRateEnabled = this.peakRateEnabled
    e.peakStart = this.peakStart
    e.peakEnd = this.peakEnd
    e.peakRateMultiplier = this.peakRateMultiplier
    e.isExclusive = this.isExclusive
    return e
  }
}
