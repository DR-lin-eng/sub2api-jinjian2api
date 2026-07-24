import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UserSubscription } from '@/features/admin-subscriptions/domain/models/userSubscription'

export class UserSubscriptionDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose({ name: 'user_id' })
  @Transform(({ value }) => value ?? 0)
  userId!: number

  @Expose({ name: 'group_id' })
  @Transform(({ value }) => value ?? 0)
  groupId!: number

  @Expose()
  @Transform(({ value }) => value ?? 'active')
  status!: 'active' | 'expired' | 'revoked' | 'suspended'

  @Expose({ name: 'starts_at' })
  @Transform(({ value }) => value ?? '')
  startsAt!: string

  @Expose({ name: 'daily_usage_usd' })
  @Transform(({ value }) => value ?? 0)
  dailyUsageUsd!: number

  @Expose({ name: 'weekly_usage_usd' })
  @Transform(({ value }) => value ?? 0)
  weeklyUsageUsd!: number

  @Expose({ name: 'monthly_usage_usd' })
  @Transform(({ value }) => value ?? 0)
  monthlyUsageUsd!: number

  @Expose({ name: 'daily_window_start' })
  @Transform(({ value }) => value ?? '')
  dailyWindowStart!: string

  @Expose({ name: 'weekly_window_start' })
  @Transform(({ value }) => value ?? '')
  weeklyWindowStart!: string

  @Expose({ name: 'monthly_window_start' })
  @Transform(({ value }) => value ?? '')
  monthlyWindowStart!: string

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'updated_at' })
  @Transform(({ value }) => value ?? '')
  updatedAt!: string

  @Expose({ name: 'revoked_at' })
  @Transform(({ value }) => value ?? '')
  revokedAt!: string

  @Expose({ name: 'expires_at' })
  @Transform(({ value }) => value ?? '')
  expiresAt!: string

  static fromJson(json: unknown): UserSubscriptionDto {
    return plainToInstance(UserSubscriptionDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserSubscription {
    const entity = new UserSubscription()
    entity.id = this.id
    entity.userId = this.userId
    entity.groupId = this.groupId
    entity.status = this.status
    entity.startsAt = this.startsAt
    entity.dailyUsageUsd = this.dailyUsageUsd
    entity.weeklyUsageUsd = this.weeklyUsageUsd
    entity.monthlyUsageUsd = this.monthlyUsageUsd
    entity.dailyWindowStart = this.dailyWindowStart
    entity.weeklyWindowStart = this.weeklyWindowStart
    entity.monthlyWindowStart = this.monthlyWindowStart
    entity.createdAt = this.createdAt
    entity.updatedAt = this.updatedAt
    entity.revokedAt = this.revokedAt
    entity.expiresAt = this.expiresAt
    return entity
  }
}
