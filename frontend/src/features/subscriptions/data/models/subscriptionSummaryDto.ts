import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { SubscriptionSummary } from '@/features/subscriptions/domain/models/subscriptionSummary'
import { SubscriptionSummaryItemDto } from './subscriptionSummaryItemDto'

export class SubscriptionSummaryDto {
  @Expose({ name: 'active_count' })
  @Transform(({ value }) => value ?? 0)
  activeCount!: number

  @Expose()
  @Type(() => SubscriptionSummaryItemDto)
  @Transform(({ value }) => value ?? [])
  subscriptions!: SubscriptionSummaryItemDto[]

  static fromJson(json: unknown): SubscriptionSummaryDto {
    return plainToInstance(SubscriptionSummaryDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): SubscriptionSummary {
    const entity = new SubscriptionSummary()
    entity.activeCount = this.activeCount
    entity.subscriptions = this.subscriptions.map(item => item.toEntity())
    return entity
  }
}
