import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PlatformQuotaItem } from '@/features/admin-users/domain/models/platformQuotaItem'

export class PlatformQuotaItemDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  platform!: string

  @Expose({ name: 'daily_limit_usd' })
  @Transform(({ value }) => value ?? null)
  dailyLimitUsd!: number | null

  @Expose({ name: 'weekly_limit_usd' })
  @Transform(({ value }) => value ?? null)
  weeklyLimitUsd!: number | null

  @Expose({ name: 'monthly_limit_usd' })
  @Transform(({ value }) => value ?? null)
  monthlyLimitUsd!: number | null

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

  @Expose({ name: 'daily_window_resets_at' })
  @Transform(({ value }) => value ?? '')
  dailyWindowResetsAt!: string

  @Expose({ name: 'weekly_window_resets_at' })
  @Transform(({ value }) => value ?? '')
  weeklyWindowResetsAt!: string

  @Expose({ name: 'monthly_window_resets_at' })
  @Transform(({ value }) => value ?? '')
  monthlyWindowResetsAt!: string

  static fromJson(json: unknown): PlatformQuotaItemDto {
    return plainToInstance(PlatformQuotaItemDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PlatformQuotaItem {
    const entity = new PlatformQuotaItem()
    entity.platform = this.platform
    entity.dailyLimitUsd = this.dailyLimitUsd ?? 0
    entity.weeklyLimitUsd = this.weeklyLimitUsd ?? 0
    entity.monthlyLimitUsd = this.monthlyLimitUsd ?? 0
    entity.dailyUsageUsd = this.dailyUsageUsd
    entity.weeklyUsageUsd = this.weeklyUsageUsd
    entity.monthlyUsageUsd = this.monthlyUsageUsd
    entity.dailyWindowStart = this.dailyWindowStart
    entity.weeklyWindowStart = this.weeklyWindowStart
    entity.monthlyWindowStart = this.monthlyWindowStart
    entity.dailyWindowResetsAt = this.dailyWindowResetsAt
    entity.weeklyWindowResetsAt = this.weeklyWindowResetsAt
    entity.monthlyWindowResetsAt = this.monthlyWindowResetsAt
    return entity
  }
}
