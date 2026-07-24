import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { SubscriptionSummaryItem } from '@/features/subscriptions/domain/models/subscriptionSummaryItem'

export class SubscriptionSummaryItemDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose({ name: 'group_id' })
  @Transform(({ value }) => value ?? 0)
  groupId!: number

  @Expose({ name: 'group_name' })
  @Transform(({ value }) => value ?? '')
  groupName!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  status!: string

  @Expose({ name: 'expires_at' })
  @Transform(({ value }) => value ?? '')
  expiresAt!: string

  @Expose({ name: 'starts_at' })
  @Transform(({ value }) => value ?? '')
  startsAt!: string

  static fromJson(json: unknown): SubscriptionSummaryItemDto {
    return plainToInstance(SubscriptionSummaryItemDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): SubscriptionSummaryItem {
    const entity = new SubscriptionSummaryItem()
    entity.id = this.id
    entity.groupId = this.groupId
    entity.groupName = this.groupName
    entity.status = this.status
    entity.expiresAt = this.expiresAt
    entity.startsAt = this.startsAt
    return entity
  }
}
