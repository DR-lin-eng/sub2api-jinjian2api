import { billingActionDatasource } from '@/features/billing/data/datasources/billingActionDatasource'
import type { BillingActionRepository } from '@/features/billing/domain/repositories/billingActionRepository'
import type { PublicOrderVerifyResult } from '@/features/billing/domain/models/publicOrderVerifyResult'
import type { RedeemCodeResult } from '@/features/billing/domain/models/redeemCodeResult'
import type { RedeemCodeRequest } from '@/features/billing/data/requests_models/redeemCodeRequest'
import type { CreateOrderRequest, CreateOrderResult } from '@/types/payment'
import type { AxiosResponse } from 'axios'

class BillingActionRepositoryImpl implements BillingActionRepository {
  private readonly ds = billingActionDatasource

  createOrder(data: CreateOrderRequest): Promise<AxiosResponse<CreateOrderResult>> {
    return this.ds.createOrder(data)
  }

  cancelOrder(id: number): Promise<AxiosResponse<unknown>> {
    return this.ds.cancelOrder(id)
  }

  verifyOrder(outTradeNo: string): Promise<AxiosResponse<unknown>> {
    return this.ds.verifyOrder(outTradeNo)
  }

  verifyOrderPublic(outTradeNo: string): Promise<PublicOrderVerifyResult> {
    return this.ds.verifyOrderPublic(outTradeNo)
  }

  resolveOrderPublicByResumeToken(resumeToken: string): Promise<PublicOrderVerifyResult> {
    return this.ds.resolveOrderPublicByResumeToken(resumeToken)
  }

  requestRefund(id: number, data: { reason: string }): Promise<AxiosResponse<unknown>> {
    return this.ds.requestRefund(id, data)
  }

  redeem(req: RedeemCodeRequest): Promise<RedeemCodeResult> {
    return this.ds.redeem(req)
  }
}

export const billingActionRepository: BillingActionRepository = new BillingActionRepositoryImpl()
