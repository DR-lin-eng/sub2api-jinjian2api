import { apiClient } from '@/core/networks/client'
import { PaymentOrder } from '@/features/admin-orders/domain/models/paymentOrder'
import { SubscriptionPlan } from '@/features/admin-orders/domain/models/subscriptionPlan'
import type { CheckoutInfoResponse } from '@/features/billing/domain/models/checkoutInfoResponse'
import type { MethodLimitsResponse } from '@/features/billing/domain/models/methodLimitsResponse'
import type { PaymentConfig } from '@/features/billing/domain/models/paymentConfig'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
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
    return apiClient.get<PaginatedResponse<PaymentOrder>>('/payment/orders/my', { params })
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
