import { billingQueryDatasource } from '@/features/billing/data/datasources/billingQueryDatasource'
import type { BillingQueryRepository } from '@/features/billing/domain/repositories/billingQueryRepository'
import type { RedeemHistoryItem } from '@/features/billing/domain/models/redeemHistoryItem'
import { PaymentOrder } from '@/features/admin-orders/domain/models/paymentOrder'
import { SubscriptionPlan } from '@/features/admin-orders/domain/models/subscriptionPlan'
import type { CheckoutInfoResponse } from '@/features/billing/domain/models/checkoutInfoResponse'
import type { MethodLimitsResponse } from '@/features/billing/domain/models/methodLimitsResponse'
import type { PaymentConfig } from '@/features/billing/domain/models/paymentConfig'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'

class BillingQueryRepositoryImpl implements BillingQueryRepository {
  private readonly ds = billingQueryDatasource

  async getConfig(): Promise<PaymentConfig> {
    return (await this.ds.getConfig()).data
  }

  async getPlans(): Promise<SubscriptionPlan[]> {
    return (await this.ds.getPlans()).data
  }

  async getCheckoutInfo(): Promise<CheckoutInfoResponse> {
    return (await this.ds.getCheckoutInfo()).data
  }

  async getLimits(): Promise<MethodLimitsResponse> {
    return (await this.ds.getLimits()).data
  }

  async getMyOrders(params?: { page?: number; page_size?: number; status?: string }): Promise<PaginatedResponse<PaymentOrder>> {
    return (await this.ds.getMyOrders(params)).data
  }

  async getOrder(id: number): Promise<PaymentOrder> {
    return (await this.ds.getOrder(id)).data
  }

  async getRefundEligibleProviders(): Promise<{ provider_instance_ids: string[] }> {
    return (await this.ds.getRefundEligibleProviders()).data
  }

  getHistory(): Promise<RedeemHistoryItem[]> {
    return this.ds.getHistory()
  }
}

export const billingQueryRepository: BillingQueryRepository = new BillingQueryRepositoryImpl()
