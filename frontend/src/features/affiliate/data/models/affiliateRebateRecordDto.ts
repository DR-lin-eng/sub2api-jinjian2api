import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { AffiliateRebateRecord } from '@/features/affiliate/domain/models/affiliateRebateRecord'

export class AffiliateRebateRecordDto {
  @Expose({ name: 'order_id' })
  @Transform(({ value }) => value ?? 0)
  orderId!: number

  @Expose({ name: 'out_trade_no' })
  @Transform(({ value }) => value ?? '')
  outTradeNo!: string

  @Expose({ name: 'inviter_id' })
  @Transform(({ value }) => value ?? 0)
  inviterId!: number

  @Expose({ name: 'inviter_email' })
  @Transform(({ value }) => value ?? '')
  inviterEmail!: string

  @Expose({ name: 'inviter_username' })
  @Transform(({ value }) => value ?? '')
  inviterUsername!: string

  @Expose({ name: 'invitee_id' })
  @Transform(({ value }) => value ?? 0)
  inviteeId!: number

  @Expose({ name: 'invitee_email' })
  @Transform(({ value }) => value ?? '')
  inviteeEmail!: string

  @Expose({ name: 'invitee_username' })
  @Transform(({ value }) => value ?? '')
  inviteeUsername!: string

  @Expose({ name: 'order_amount' })
  @Transform(({ value }) => value ?? 0)
  orderAmount!: number

  @Expose({ name: 'pay_amount' })
  @Transform(({ value }) => value ?? 0)
  payAmount!: number

  @Expose({ name: 'rebate_amount' })
  @Transform(({ value }) => value ?? 0)
  rebateAmount!: number

  @Expose({ name: 'payment_type' })
  @Transform(({ value }) => value ?? '')
  paymentType!: string

  @Expose({ name: 'order_status' })
  @Transform(({ value }) => value ?? '')
  orderStatus!: string

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  static fromJson(json: unknown): AffiliateRebateRecordDto {
    return plainToInstance(AffiliateRebateRecordDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AffiliateRebateRecord {
    const e = new AffiliateRebateRecord()
    e.orderId = this.orderId
    e.outTradeNo = this.outTradeNo
    e.inviterId = this.inviterId
    e.inviterEmail = this.inviterEmail
    e.inviterUsername = this.inviterUsername
    e.inviteeId = this.inviteeId
    e.inviteeEmail = this.inviteeEmail
    e.inviteeUsername = this.inviteeUsername
    e.orderAmount = this.orderAmount
    e.payAmount = this.payAmount
    e.rebateAmount = this.rebateAmount
    e.paymentType = this.paymentType
    e.orderStatus = this.orderStatus
    e.createdAt = this.createdAt
    return e
  }
}
