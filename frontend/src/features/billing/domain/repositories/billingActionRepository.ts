import type { PublicOrderVerifyResult } from '@/features/billing/domain/models/publicOrderVerifyResult'
import type { RedeemCodeResult } from '@/features/billing/domain/models/redeemCodeResult'
import type { RedeemCodeRequest } from '@/features/billing/data/requests_models/redeemCodeRequest'
import type { CreateOrderRequest } from '@/features/billing/data/requests_models/createOrderRequest'
import type { CreateOrderResult } from '@/features/billing/domain/models/createOrderResult'
import type { AxiosResponse } from 'axios'

export interface BillingActionRepository {
  createOrder(data: CreateOrderRequest): Promise<AxiosResponse<CreateOrderResult>>
  cancelOrder(id: number): Promise<AxiosResponse<unknown>>
  verifyOrder(outTradeNo: string): Promise<AxiosResponse<unknown>>
  verifyOrderPublic(outTradeNo: string): Promise<PublicOrderVerifyResult>
  resolveOrderPublicByResumeToken(resumeToken: string): Promise<PublicOrderVerifyResult>
  requestRefund(id: number, data: { reason: string }): Promise<AxiosResponse<unknown>>
  redeem(req: RedeemCodeRequest): Promise<RedeemCodeResult>
}
