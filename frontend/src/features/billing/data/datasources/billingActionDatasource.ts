import { apiClient } from '@/core/networks/client'
import type { CreateOrderRequest, CreateOrderResult } from '@/types/payment'
import { PublicOrderVerifyResultDto } from '@/features/billing/data/models/publicOrderVerifyResultDto'
import { RedeemCodeResultDto } from '@/features/billing/data/models/redeemCodeResultDto'
import type { PublicOrderVerifyResult } from '@/features/billing/domain/models/publicOrderVerifyResult'
import type { RedeemCodeResult } from '@/features/billing/domain/models/redeemCodeResult'
import type { RedeemCodeRequest } from '@/features/billing/data/requests_models/redeemCodeRequest'

export class BillingActionDatasource {
  createOrder(data: CreateOrderRequest) {
    return apiClient.post<CreateOrderResult>('/payment/orders', data)
  }

  cancelOrder(id: number) {
    return apiClient.post(`/payment/orders/${id}/cancel`)
  }

  verifyOrder(outTradeNo: string) {
    return apiClient.post('/payment/orders/verify', { out_trade_no: outTradeNo })
  }

  async verifyOrderPublic(outTradeNo: string): Promise<PublicOrderVerifyResult> {
    const { data } = await apiClient.post<unknown>('/payment/public/orders/verify', { out_trade_no: outTradeNo })
    return PublicOrderVerifyResultDto.fromJson(data).toEntity()
  }

  async resolveOrderPublicByResumeToken(resumeToken: string): Promise<PublicOrderVerifyResult> {
    const { data } = await apiClient.post<unknown>('/payment/public/orders/resolve', { resume_token: resumeToken })
    return PublicOrderVerifyResultDto.fromJson(data).toEntity()
  }

  requestRefund(id: number, data: { reason: string }) {
    return apiClient.post(`/payment/orders/${id}/refund-request`, data)
  }

  async redeem(req: RedeemCodeRequest): Promise<RedeemCodeResult> {
    const { data } = await apiClient.post<unknown>('/redeem', req)
    return RedeemCodeResultDto.fromJson(data).toEntity()
  }
}

export const billingActionDatasource = new BillingActionDatasource()
