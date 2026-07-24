import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { SubscriptionQuotaWindow } from '@/features/admin-subscriptions/domain/models/subscriptionQuotaWindow'

export class SubscriptionQuotaWindowDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  used!: number

  @Expose()
  @Transform(({ value }) => value ?? null)
  limit!: number | null

  @Expose()
  @Transform(({ value }) => value ?? 0)
  percentage!: number

  @Expose({ name: 'reset_in_seconds' })
  @Transform(({ value }) => value ?? null)
  resetInSeconds!: number | null

  static fromJson(json: unknown): SubscriptionQuotaWindowDto {
    return plainToInstance(SubscriptionQuotaWindowDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): SubscriptionQuotaWindow {
    const entity = new SubscriptionQuotaWindow()
    entity.used = this.used
    entity.limit = this.limit
    entity.percentage = this.percentage
    entity.resetInSeconds = this.resetInSeconds
    return entity
  }
}
