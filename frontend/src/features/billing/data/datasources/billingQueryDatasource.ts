import { apiClient } from '@/core/networks/client'
import type {
  PaymentConfig,
  SubscriptionPlan,
  MethodLimitsResponse,
  CheckoutInfoResponse,
  PaymentOrder,
} from '@/types/payment'
import type { BasePaginationResponse } from '@/types'
import { RedeemHistoryItemDto } from '@/features/billing/data/models/redeemHistoryItemDto'
import type { RedeemHistoryItem } from '@/features/billing/domain/models/redeemHistoryItem'

export class BillingQueryDatasource {
  getConfig() {
    return apiClient.get<PaymentConfig>('/payment/config')
  }

  getPlans() {
    return apiClient.get<SubscriptionPlan[]>('/payment/plans')
  }

  getCheckoutInfo() {
    return apiClient.get<CheckoutInfoResponse>('/payment/checkout-info')
  }

  getLimits() {
    return apiClient.get<MethodLimitsResponse>('/payment/limits')
  }

  getMyOrders(params?: { page?: number; page_size?: number; status?: string }) {
    return apiClient.get<BasePaginationResponse<PaymentOrder>>('/payment/orders/my', { params })
  }

  getOrder(id: number) {
    return apiClient.get<PaymentOrder>(`/payment/orders/${id}`)
  }

  getRefundEligibleProviders() {
    return apiClient.get<{ provider_instance_ids: string[] }>('/payment/orders/refund-eligible-providers')
  }

  async getHistory(): Promise<RedeemHistoryItem[]> {
    const { data } = await apiClient.get<unknown[]>('/redeem/history')
    return (data ?? []).map(item => RedeemHistoryItemDto.fromJson(item).toEntity())
  }
}

export const billingQueryDatasource = new BillingQueryDatasource()
