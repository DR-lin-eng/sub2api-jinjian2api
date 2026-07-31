import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AccountUsageHistory } from '@/features/admin-accounts/domain/models/accountUsageHistory'

export class AccountUsageHistoryDto {
  @Expose() @Transform(({ value }) => value ?? '') date!: string
  @Expose() @Transform(({ value }) => value ?? '') label!: string
  @Expose() @Transform(({ value }) => value ?? 0) requests!: number
  @Expose() @Transform(({ value }) => value ?? 0) tokens!: number
  @Expose() @Transform(({ value }) => value ?? 0) cost!: number
  @Expose({ name: 'actual_cost' }) @Transform(({ value }) => value ?? 0) actualCost!: number
  @Expose({ name: 'user_cost' }) @Transform(({ value }) => value ?? 0) userCost!: number

  static fromJson(json: unknown): AccountUsageHistoryDto {
    return plainToInstance(AccountUsageHistoryDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AccountUsageHistory {
    const e = new AccountUsageHistory()
    e.date = this.date
    e.label = this.label
    e.requests = this.requests
    e.tokens = this.tokens
    e.cost = this.cost
    e.actualCost = this.actualCost
    e.userCost = this.userCost
    return e
  }
}
