import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AccountUsageDayBreakdown } from '@/features/admin-accounts/domain/models/accountUsageDayBreakdown'

export class AccountUsageDayBreakdownDto {
  @Expose() @Transform(({ value }) => value ?? '') date!: string
  @Expose() @Transform(({ value }) => value ?? 0) cost!: number
  @Expose({ name: 'user_cost' }) @Transform(({ value }) => value ?? 0) userCost!: number
  @Expose() @Transform(({ value }) => value ?? 0) requests!: number
  @Expose() @Transform(({ value }) => value ?? 0) tokens!: number

  static fromJson(json: unknown): AccountUsageDayBreakdownDto {
    return plainToInstance(AccountUsageDayBreakdownDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AccountUsageDayBreakdown {
    const e = new AccountUsageDayBreakdown()
    e.date = this.date
    e.cost = this.cost
    e.userCost = this.userCost
    e.requests = this.requests
    e.tokens = this.tokens
    return e
  }
}
