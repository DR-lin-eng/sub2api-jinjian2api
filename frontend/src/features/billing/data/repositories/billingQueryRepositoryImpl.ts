import { billingQueryDatasource } from '@/features/billing/data/datasources/billingQueryDatasource'
import type { BillingQueryRepository } from '@/features/billing/domain/repositories/billingQueryRepository'
import type { RedeemHistoryItem } from '@/features/billing/domain/models/redeemHistoryItem'
import type { PaymentConfig, SubscriptionPlan, MethodLimitsResponse, CheckoutInfoResponse, PaymentOrder } from '@/types/payment'
import type { BasePaginationResponse } from '@/types'
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

  getMyOrders(params?: { page?: number; page_size?: number; status?: string }): Promise<AxiosResponse<BasePaginationResponse<PaymentOrder>>> {
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
