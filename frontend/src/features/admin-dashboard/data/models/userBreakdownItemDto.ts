import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { UserBreakdownItem } from '@/features/admin-dashboard/domain/models/userBreakdownItem'

export class UserBreakdownItemDto {
  @Expose({ name: 'user_id' })
  @Transform(({ value }) => value ?? 0)
  userId!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  email!: string

  @Expose()
  @Transform(({ value }) => value ?? 0)
  requests!: number

  @Expose({ name: 'input_tokens' })
  @Transform(({ value }) => value ?? 0)
  inputTokens!: number

  @Expose({ name: 'output_tokens' })
  @Transform(({ value }) => value ?? 0)
  outputTokens!: number

  @Expose({ name: 'cache_tokens' })
  @Transform(({ value }) => value ?? 0)
  cacheTokens!: number

  @Expose({ name: 'total_tokens' })
  @Transform(({ value }) => value ?? 0)
  totalTokens!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  cost!: number

  @Expose({ name: 'actual_cost' })
  @Transform(({ value }) => value ?? 0)
  actualCost!: number

  @Expose({ name: 'account_cost' })
  @Transform(({ value }) => value ?? 0)
  accountCost!: number

  static fromJson(json: unknown): UserBreakdownItemDto {
    return plainToInstance(UserBreakdownItemDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UserBreakdownItem {
    const entity = new UserBreakdownItem()
    entity.userId = this.userId
    entity.email = this.email
    entity.requests = this.requests
    entity.inputTokens = this.inputTokens
    entity.outputTokens = this.outputTokens
    entity.cacheTokens = this.cacheTokens
    entity.totalTokens = this.totalTokens
    entity.cost = this.cost
    entity.actualCost = this.actualCost
    entity.accountCost = this.accountCost
    return entity
  }
}
