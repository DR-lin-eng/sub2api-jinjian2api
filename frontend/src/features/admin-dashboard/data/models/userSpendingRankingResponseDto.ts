import 'reflect-metadata'
import { Expose, Transform, plainToInstance, Type } from 'class-transformer'
import { UserSpendingRankingItemDto } from './userSpendingRankingItemDto'
import { UserSpendingRankingResponse } from '@/features/admin-dashboard/domain/models/userSpendingRankingResponse'
import { UserSpendingRankingItem } from '@/features/admin-dashboard/domain/models/userSpendingRankingItem'

export class UserSpendingRankingResponseDto {
  @Expose()
  @Type(() => UserSpendingRankingItemDto)
  ranking!: UserSpendingRankingItemDto[]

  @Expose({ name: 'total_actual_cost' })
  @Transform(({ value }) => value ?? 0)
  totalActualCost!: number

  @Expose({ name: 'total_requests' })
  @Transform(({ value }) => value ?? 0)
  totalRequests!: number

  @Expose({ name: 'total_tokens' })
  @Transform(({ value }) => value ?? 0)
  totalTokens!: number

  @Expose({ name: 'start_date' })
  @Transform(({ value }) => value ?? '')
  startDate!: string

  @Expose({ name: 'end_date' })
  @Transform(({ value }) => value ?? '')
  endDate!: string

  static fromJson(json: unknown): UserSpendingRankingResponseDto {
    return plainToInstance(UserSpendingRankingResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserSpendingRankingResponse {
    const entity = new UserSpendingRankingResponse()
    entity.ranking = (this.ranking ?? []).map(d => d.toEntity()) as UserSpendingRankingItem[]
    entity.totalActualCost = this.totalActualCost
    entity.totalRequests = this.totalRequests
    entity.totalTokens = this.totalTokens
    entity.startDate = this.startDate
    entity.endDate = this.endDate
    return entity
  }
}
