import { billingActionDatasource } from '@/features/billing/data/datasources/billingActionDatasource'
import type { BillingActionRepository } from '@/features/billing/domain/repositories/billingActionRepository'
import type { PublicOrderVerifyResult } from '@/features/billing/domain/models/publicOrderVerifyResult'
import type { RedeemCodeResult } from '@/features/billing/domain/models/redeemCodeResult'
import type { RedeemCodeRequest } from '@/features/billing/data/requests_models/redeemCodeRequest'
import type { CreateOrderRequest } from '@/features/billing/data/requests_models/createOrderRequest'
import type { CreateOrderResult } from '@/features/billing/domain/models/createOrderResult'
import type { PaymentOrder } from '@/features/admin-orders/domain/models/paymentOrder'

class BillingActionRepositoryImpl implements BillingActionRepository {
  private readonly ds = billingActionDatasource

  async createOrder(data: CreateOrderRequest): Promise<CreateOrderResult> {
    return (await this.ds.createOrder(data)).data
  }

  async cancelOrder(id: number): Promise<unknown> {
    return (await this.ds.cancelOrder(id)).data
  }

  async verifyOrder(outTradeNo: string): Promise<PaymentOrder> {
    return (await this.ds.verifyOrder(outTradeNo)).data
  }

  verifyOrderPublic(outTradeNo: string): Promise<PublicOrderVerifyResult> {
    return this.ds.verifyOrderPublic(outTradeNo)
  }

  resolveOrderPublicByResumeToken(resumeToken: string): Promise<PublicOrderVerifyResult> {
    return this.ds.resolveOrderPublicByResumeToken(resumeToken)
  }

  async requestRefund(id: number, data: { reason: string }): Promise<unknown> {
    return (await this.ds.requestRefund(id, data)).data
  }

  redeem(req: RedeemCodeRequest): Promise<RedeemCodeResult> {
    return this.ds.redeem(req)
  }
}

export const billingActionRepository: BillingActionRepository = new BillingActionRepositoryImpl()
