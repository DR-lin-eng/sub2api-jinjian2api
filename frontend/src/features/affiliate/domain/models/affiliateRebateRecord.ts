import type { OrderStatus } from '@/features/admin-orders/enums/orderTypes'

export class AffiliateRebateRecord {
  orderId!: number
  outTradeNo!: string
  inviterId!: number
  inviterEmail!: string
  inviterUsername!: string
  inviteeId!: number
  inviteeEmail!: string
  inviteeUsername!: string
  orderAmount!: number
  payAmount!: number
  rebateAmount!: number
  paymentType!: string
  orderStatus!: OrderStatus
  createdAt!: string
}
