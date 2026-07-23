import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AccountUsageHighestRequestDay } from '@/features/admin-accounts/domain/models/accountUsageHighestRequestDay'

export class AccountUsageHighestRequestDayDto {
  @Expose() @Transform(({ value }) => value ?? '') date!: string
  @Expose() @Transform(({ value }) => value ?? '') label!: string
  @Expose() @Transform(({ value }) => value ?? 0) requests!: number
  @Expose() @Transform(({ value }) => value ?? 0) cost!: number
  @Expose({ name: 'user_cost' }) @Transform(({ value }) => value ?? 0) userCost!: number

  static fromJson(json: unknown): AccountUsageHighestRequestDayDto {
    return plainToInstance(AccountUsageHighestRequestDayDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AccountUsageHighestRequestDay {
    const e = new AccountUsageHighestRequestDay()
    e.date = this.date
    e.label = this.label
    e.requests = this.requests
    e.cost = this.cost
    e.userCost = this.userCost
    return e
  }
}
