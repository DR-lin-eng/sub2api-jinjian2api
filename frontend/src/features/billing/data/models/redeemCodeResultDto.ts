import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { RedeemCodeResult } from '@/features/billing/domain/models/redeemCodeResult'

export class RedeemCodeResultDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  message!: string

  @Expose()
  @Transform(({ value }) => value ?? '')
  type!: string

  @Expose()
  @Transform(({ value }) => value ?? 0)
  value!: number

  @Expose({ name: 'new_balance' })
  newBalance?: number

  @Expose({ name: 'new_concurrency' })
  newConcurrency?: number

  @Expose({ name: 'group_name' })
  groupName?: string

  @Expose({ name: 'validity_days' })
  validityDays?: number

  static fromJson(json: unknown): RedeemCodeResultDto {
    return plainToInstance(RedeemCodeResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): RedeemCodeResult {
    const entity = new RedeemCodeResult()
    entity.message = this.message
    entity.type = this.type
    entity.value = this.value
    entity.newBalance = this.newBalance
    entity.newConcurrency = this.newConcurrency
    entity.groupName = this.groupName
    entity.validityDays = this.validityDays
    return entity
  }
}
