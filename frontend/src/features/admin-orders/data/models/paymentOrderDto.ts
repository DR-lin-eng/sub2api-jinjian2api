import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PaymentOrder } from '@/features/admin-orders/domain/models/paymentOrder'
import type { OrderStatus, OrderType } from '@/features/admin-orders/enums/orderTypes'

export class PaymentOrderDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  id!: number

  @Expose({ name: 'user_id' })
  @Transform(({ value }) => value ?? 0)
  userId!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  amount!: number

  @Expose({ name: 'pay_amount' })
  @Transform(({ value }) => value ?? 0)
  payAmount!: number

  @Expose()
  @Transform(({ value }) => value ?? '')
  currency!: string

  @Expose({ name: 'fee_rate' })
  @Transform(({ value }) => value ?? 0)
  feeRate!: number

  @Expose({ name: 'payment_type' })
  @Transform(({ value }) => value ?? '')
  paymentType!: string

  @Expose({ name: 'out_trade_no' })
  @Transform(({ value }) => value ?? '')
  outTradeNo!: string

  @Expose()
  status!: OrderStatus

  @Expose({ name: 'order_type' })
  orderType!: OrderType

  @Expose({ name: 'created_at' })
  @Transform(({ value }) => value ?? '')
  createdAt!: string

  @Expose({ name: 'expires_at' })
  @Transform(({ value }) => value ?? '')
  expiresAt!: string

  @Expose({ name: 'paid_at' })
  @Transform(({ value }) => value ?? '')
  paidAt!: string

  @Expose({ name: 'completed_at' })
  @Transform(({ value }) => value ?? '')
  completedAt!: string

  @Expose({ name: 'refund_amount' })
  @Transform(({ value }) => value ?? 0)
  refundAmount!: number

  @Expose({ name: 'refund_reason' })
  @Transform(({ value }) => value ?? '')
  refundReason!: string

  @Expose({ name: 'refund_requested_at' })
  @Transform(({ value }) => value ?? '')
  refundRequestedAt!: string

  @Expose({ name: 'refund_requested_by' })
  @Transform(({ value }) => value ?? 0)
  refundRequestedBy!: number

  @Expose({ name: 'refund_request_reason' })
  @Transform(({ value }) => value ?? '')
  refundRequestReason!: string

  @Expose({ name: 'plan_id' })
  @Transform(({ value }) => value ?? 0)
  planId!: number

  @Expose({ name: 'provider_instance_id' })
  @Transform(({ value }) => value ?? '')
  providerInstanceId!: string

  static fromJson(json: unknown): PaymentOrderDto {
    return plainToInstance(PaymentOrderDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PaymentOrder {
    const entity = new PaymentOrder()
    entity.id = this.id
    entity.userId = this.userId
    entity.amount = this.amount
    entity.payAmount = this.payAmount
    entity.currency = this.currency
    entity.feeRate = this.feeRate
    entity.paymentType = this.paymentType
    entity.outTradeNo = this.outTradeNo
    entity.status = this.status
    entity.orderType = this.orderType
    entity.createdAt = this.createdAt
    entity.expiresAt = this.expiresAt
    entity.paidAt = this.paidAt
    entity.completedAt = this.completedAt
    entity.refundAmount = this.refundAmount
    entity.refundReason = this.refundReason
    entity.refundRequestedAt = this.refundRequestedAt
    entity.refundRequestedBy = this.refundRequestedBy
    entity.refundRequestReason = this.refundRequestReason
    entity.planId = this.planId
    entity.providerInstanceId = this.providerInstanceId
    return entity
  }
}
