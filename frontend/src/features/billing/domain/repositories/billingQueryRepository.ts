import type { RedeemHistoryItem } from '@/features/billing/domain/models/redeemHistoryItem'
import type {
  PaymentConfig,
  SubscriptionPlan,
  MethodLimitsResponse,
  CheckoutInfoResponse,
  PaymentOrder,
} from '@/types/payment'
import type { BasePaginationResponse } from '@/types'
import type { AxiosResponse } from 'axios'

export interface BillingQueryRepository {
  getConfig(): Promise<AxiosResponse<PaymentConfig>>
  getPlans(): Promise<AxiosResponse<SubscriptionPlan[]>>
  getCheckoutInfo(): Promise<AxiosResponse<CheckoutInfoResponse>>
  getLimits(): Promise<AxiosResponse<MethodLimitsResponse>>
  getMyOrders(params?: { page?: number; page_size?: number; status?: string }): Promise<AxiosResponse<BasePaginationResponse<PaymentOrder>>>
  getOrder(id: number): Promise<AxiosResponse<PaymentOrder>>
  getRefundEligibleProviders(): Promise<AxiosResponse<{ provider_instance_ids: string[] }>>
  getHistory(): Promise<RedeemHistoryItem[]>
}
