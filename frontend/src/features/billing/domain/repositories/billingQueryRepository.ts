import type { RedeemHistoryItem } from '@/features/billing/domain/models/redeemHistoryItem'
import { PaymentOrder } from '@/features/admin-orders/domain/models/paymentOrder'
import { SubscriptionPlan } from '@/features/admin-orders/domain/models/subscriptionPlan'
import type { CheckoutInfoResponse } from '@/features/billing/domain/models/checkoutInfoResponse'
import type { MethodLimitsResponse } from '@/features/billing/domain/models/methodLimitsResponse'
import type { PaymentConfig } from '@/features/billing/domain/models/paymentConfig'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'

export interface BillingQueryRepository {
  getConfig(): Promise<PaymentConfig>
  getPlans(): Promise<SubscriptionPlan[]>
  getCheckoutInfo(): Promise<CheckoutInfoResponse>
  getLimits(): Promise<MethodLimitsResponse>
  getMyOrders(params?: { page?: number; page_size?: number; status?: string }): Promise<PaginatedResponse<PaymentOrder>>
  getOrder(id: number): Promise<PaymentOrder>
  getRefundEligibleProviders(): Promise<{ provider_instance_ids: string[] }>
  getHistory(): Promise<RedeemHistoryItem[]>
}
