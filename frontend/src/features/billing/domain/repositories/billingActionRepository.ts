import type { PublicOrderVerifyResult } from '@/features/billing/domain/models/publicOrderVerifyResult'
import type { RedeemCodeResult } from '@/features/billing/domain/models/redeemCodeResult'
import type { RedeemCodeRequest } from '@/features/billing/data/requests_models/redeemCodeRequest'
import type { CreateOrderRequest } from '@/features/billing/data/requests_models/createOrderRequest'
import type { CreateOrderResult } from '@/features/billing/domain/models/createOrderResult'
import type { PaymentOrder } from '@/features/admin-orders/domain/models/paymentOrder'

export interface BillingActionRepository {
  createOrder(data: CreateOrderRequest): Promise<CreateOrderResult>
  cancelOrder(id: number): Promise<unknown>
  verifyOrder(outTradeNo: string): Promise<PaymentOrder>
  verifyOrderPublic(outTradeNo: string): Promise<PublicOrderVerifyResult>
  resolveOrderPublicByResumeToken(resumeToken: string): Promise<PublicOrderVerifyResult>
  requestRefund(id: number, data: { reason: string }): Promise<unknown>
  redeem(req: RedeemCodeRequest): Promise<RedeemCodeResult>
}
