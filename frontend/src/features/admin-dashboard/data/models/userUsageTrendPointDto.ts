import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UserUsageTrendPoint } from '@/features/admin-dashboard/domain/models/userUsageTrendPoint'

export class UserUsageTrendPointDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  date!: string

  @Expose({ name: 'user_id' })
  @Transform(({ value }) => value ?? 0)
  userId!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  email!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  username!: string

  @Expose()
  @Transform(({ value }) => value ?? 0)
  requests!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  tokens!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  cost!: number

  @Expose({ name: 'actual_cost' })
  @Transform(({ value }) => value ?? 0)
  actualCost!: number

  static fromJson(json: unknown): UserUsageTrendPointDto {
    return plainToInstance(UserUsageTrendPointDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserUsageTrendPoint {
    const entity = new UserUsageTrendPoint()
    entity.date = this.date
    entity.userId = this.userId
    entity.email = this.email
    entity.username = this.username
    entity.requests = this.requests
    entity.tokens = this.tokens
    entity.cost = this.cost
    entity.actualCost = this.actualCost
    return entity
  }
}
