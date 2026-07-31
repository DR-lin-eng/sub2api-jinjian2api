import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { SubscriptionProgress } from '@/features/admin-subscriptions/domain/models/subscriptionProgress'
import { SubscriptionQuotaWindowDto } from './subscriptionQuotaWindowDto'

export class SubscriptionProgressDto {
  @Expose({ name: 'subscription_id' })
  @Transform(({ value }) => value ?? 0)
  subscriptionId!: number

  @Expose()
  @Type(() => SubscriptionQuotaWindowDto)
  daily?: SubscriptionQuotaWindowDto

  @Expose()
  @Type(() => SubscriptionQuotaWindowDto)
  weekly?: SubscriptionQuotaWindowDto

  @Expose()
  @Type(() => SubscriptionQuotaWindowDto)
  monthly?: SubscriptionQuotaWindowDto

  @Expose({ name: 'expires_at' })
  @Transform(({ value }) => value ?? '')
  expiresAt!: string

  @Expose({ name: 'days_remaining' })
  @Transform(({ value }) => value ?? null)
  daysRemaining!: number | null

  static fromJson(json: unknown): SubscriptionProgressDto {
    return plainToInstance(SubscriptionProgressDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): SubscriptionProgress {
    const entity = new SubscriptionProgress()
    entity.subscriptionId = this.subscriptionId
    entity.daily = this.daily?.toEntity()
    entity.weekly = this.weekly?.toEntity()
    entity.monthly = this.monthly?.toEntity()
    entity.expiresAt = this.expiresAt
    entity.daysRemaining = this.daysRemaining
    return entity
  }
}
