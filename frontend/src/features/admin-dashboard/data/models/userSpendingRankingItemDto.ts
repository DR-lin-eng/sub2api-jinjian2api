import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UserSpendingRankingItem } from '@/features/admin-dashboard/domain/models/userSpendingRankingItem'

export class UserSpendingRankingItemDto {
  @Expose({ name: 'user_id' })
  @Transform(({ value }) => value ?? 0)
  userId!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  email!: string

  @Expose({ name: 'actual_cost' })
  @Transform(({ value }) => value ?? 0)
  actualCost!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  requests!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  tokens!: number

  static fromJson(json: unknown): UserSpendingRankingItemDto {
    return plainToInstance(UserSpendingRankingItemDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserSpendingRankingItem {
    const entity = new UserSpendingRankingItem()
    entity.userId = this.userId
    entity.email = this.email
    entity.actualCost = this.actualCost
    entity.requests = this.requests
    entity.tokens = this.tokens
    return entity
  }
}
