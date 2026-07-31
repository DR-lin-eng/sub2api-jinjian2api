import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AccountUsageHighestCostDay } from '@/features/admin-accounts/domain/models/accountUsageHighestCostDay'

export class AccountUsageHighestCostDayDto {
  @Expose() @Transform(({ value }) => value ?? '') date!: string
  @Expose() @Transform(({ value }) => value ?? '') label!: string
  @Expose() @Transform(({ value }) => value ?? 0) cost!: number
  @Expose({ name: 'user_cost' }) @Transform(({ value }) => value ?? 0) userCost!: number
  @Expose() @Transform(({ value }) => value ?? 0) requests!: number

  static fromJson(json: unknown): AccountUsageHighestCostDayDto {
    return plainToInstance(AccountUsageHighestCostDayDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AccountUsageHighestCostDay {
    const e = new AccountUsageHighestCostDay()
    e.date = this.date
    e.label = this.label
    e.cost = this.cost
    e.userCost = this.userCost
    e.requests = this.requests
    return e
  }
}
