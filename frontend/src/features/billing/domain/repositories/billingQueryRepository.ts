import type { RedeemHistoryItem } from '@/features/billing/domain/models/redeemHistoryItem'
import { PaymentOrder } from '@/features/admin-orders/domain/models/paymentOrder'
import { SubscriptionPlan } from '@/features/admin-orders/domain/models/subscriptionPlan'
import type { CheckoutInfoResponse } from '@/features/billing/domain/models/checkoutInfoResponse'
import type { MethodLimitsResponse } from '@/features/billing/domain/models/methodLimitsResponse'
import type { PaymentConfig } from '@/features/billing/domain/models/paymentConfig'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import type { AxiosResponse } from 'axios'

export interface BillingQueryRepository {
  getConfig(): Promise<AxiosResponse<PaymentConfig>>
  getPlans(): Promise<AxiosResponse<SubscriptionPlan[]>>
  getCheckoutInfo(): Promise<AxiosResponse<CheckoutInfoResponse>>
  getLimits(): Promise<AxiosResponse<MethodLimitsResponse>>
  getMyOrders(params?: { page?: number; page_size?: number; status?: string }): Promise<AxiosResponse<PaginatedResponse<PaymentOrder>>>
  getOrder(id: number): Promise<AxiosResponse<PaymentOrder>>
  getRefundEligibleProviders(): Promise<AxiosResponse<{ provider_instance_ids: string[] }>>
  getHistory(): Promise<RedeemHistoryItem[]>
}
