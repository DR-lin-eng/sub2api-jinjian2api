import { billingQueryDatasource } from '@/features/billing/data/datasources/billingQueryDatasource'
import type { BillingQueryRepository } from '@/features/billing/domain/repositories/billingQueryRepository'
import type { RedeemHistoryItem } from '@/features/billing/domain/models/redeemHistoryItem'
import { PaymentOrder } from '@/features/admin-orders/domain/models/paymentOrder'
import { SubscriptionPlan } from '@/features/admin-orders/domain/models/subscriptionPlan'
import type { CheckoutInfoResponse } from '@/features/billing/domain/models/checkoutInfoResponse'
import type { MethodLimitsResponse } from '@/features/billing/domain/models/methodLimitsResponse'
import type { PaymentConfig } from '@/features/billing/domain/models/paymentConfig'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import type { AxiosResponse } from 'axios'

class BillingQueryRepositoryImpl implements BillingQueryRepository {
  private readonly ds = billingQueryDatasource

  getConfig(): Promise<AxiosResponse<PaymentConfig>> {
    return this.ds.getConfig()
  }

  getPlans(): Promise<AxiosResponse<SubscriptionPlan[]>> {
    return this.ds.getPlans()
  }

  getCheckoutInfo(): Promise<AxiosResponse<CheckoutInfoResponse>> {
    return this.ds.getCheckoutInfo()
  }

  getLimits(): Promise<AxiosResponse<MethodLimitsResponse>> {
    return this.ds.getLimits()
  }

  getMyOrders(params?: { page?: number; page_size?: number; status?: string }): Promise<AxiosResponse<PaginatedResponse<PaymentOrder>>> {
    return this.ds.getMyOrders(params)
  }

  getOrder(id: number): Promise<AxiosResponse<PaymentOrder>> {
    return this.ds.getOrder(id)
  }

  getRefundEligibleProviders(): Promise<AxiosResponse<{ provider_instance_ids: string[] }>> {
    return this.ds.getRefundEligibleProviders()
  }

  getHistory(): Promise<RedeemHistoryItem[]> {
    return this.ds.getHistory()
  }
}

export const billingQueryRepository: BillingQueryRepository = new BillingQueryRepositoryImpl()
