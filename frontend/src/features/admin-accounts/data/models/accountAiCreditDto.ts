import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AccountAiCredit } from '@/features/admin-accounts/domain/models/accountAiCredit'

export class AccountAiCreditDto {
  @Expose({ name: 'credit_type' }) @Transform(({ value }) => value ?? '') creditType!: string
  @Expose() @Transform(({ value }) => value ?? 0) amount!: number
  @Expose({ name: 'minimum_balance' }) @Transform(({ value }) => value ?? 0) minimumBalance!: number

  static fromJson(json: unknown): AccountAiCreditDto {
    return plainToInstance(AccountAiCreditDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AccountAiCredit {
    const e = new AccountAiCredit()
    e.creditType = this.creditType
    e.amount = this.amount
    e.minimumBalance = this.minimumBalance
    return e
  }
}
