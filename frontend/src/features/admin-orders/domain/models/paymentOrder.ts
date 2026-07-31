import type { OrderStatus, OrderType } from '@/features/admin-orders/enums/orderTypes'

export class PaymentOrder {
  id!: number
  userId!: number
  amount!: number
  payAmount!: number
  currency!: string
  feeRate!: number
  paymentType!: string
  outTradeNo!: string
  status!: OrderStatus
  orderType!: OrderType
  createdAt!: string
  expiresAt!: string
  paidAt!: string
  completedAt!: string
  refundAmount!: number
  refundReason!: string
  refundRequestedAt!: string
  refundRequestedBy!: number
  refundRequestReason!: string
  planId!: number
  providerInstanceId!: string
}
