import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { RefundResult } from '@/features/admin-orders/domain/models/refundResult'

export class RefundResultDto {
  @Expose()
  @Transform(({ value }) => value ?? false)
  success!: boolean

  @Expose()
  @Transform(({ value }) => value ?? '')
  warning!: string

  @Expose({ name: 'require_force' })
  @Transform(({ value }) => value ?? false)
  requireForce!: boolean

  @Expose({ name: 'balance_deducted' })
  @Transform(({ value }) => value ?? 0)
  balanceDeducted!: number

  @Expose({ name: 'subscription_days_deducted' })
  @Transform(({ value }) => value ?? 0)
  subscriptionDaysDeducted!: number

  static fromJson(json: unknown): RefundResultDto {
    return plainToInstance(RefundResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): RefundResult {
    const entity = new RefundResult()
    entity.success = this.success
    entity.warning = this.warning
    entity.requireForce = this.requireForce
    entity.balanceDeducted = this.balanceDeducted
    entity.subscriptionDaysDeducted = this.subscriptionDaysDeducted
    return entity
  }
}
