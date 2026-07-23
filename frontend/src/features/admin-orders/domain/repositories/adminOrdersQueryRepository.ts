import type { AdminPaymentConfig } from '@/features/admin-orders/domain/models/adminPaymentConfig'
import type { DashboardStats } from '@/features/admin-orders/domain/models/dashboardStats'
import type { PaymentOrder } from '@/features/admin-orders/domain/models/paymentOrder'
import type { SubscriptionPlan } from '@/features/admin-orders/domain/models/subscriptionPlan'
import type { ProviderInstance } from '@/features/admin-orders/domain/models/providerInstance'
import type { GetOrdersRequest } from '@/features/admin-orders/data/requests_models/getOrdersRequest'
import type { BasePaginationResponse } from '@/types'

export interface AdminOrdersQueryRepository {
  getConfig(): Promise<AdminPaymentConfig>
  getDashboard(days?: number): Promise<DashboardStats>
  getOrders(req?: GetOrdersRequest): Promise<BasePaginationResponse<PaymentOrder>>
  getOrder(id: number): Promise<unknown>
  getPlans(): Promise<SubscriptionPlan[]>
  getProviders(): Promise<ProviderInstance[]>
}
