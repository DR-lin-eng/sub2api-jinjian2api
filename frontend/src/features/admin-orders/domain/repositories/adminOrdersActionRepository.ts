import type { AdminPaymentConfig } from '@/features/admin-orders/domain/models/adminPaymentConfig'
import type { RefundResult } from '@/features/admin-orders/domain/models/refundResult'
import type { SubscriptionPlan } from '@/features/admin-orders/domain/models/subscriptionPlan'
import type { ProviderInstance } from '@/features/admin-orders/domain/models/providerInstance'
import type { UpdatePaymentConfigRequest } from '@/features/admin-orders/data/requests_models/updatePaymentConfigRequest'
import type { RefundOrderRequest } from '@/features/admin-orders/data/requests_models/refundOrderRequest'
import type { CreateSubscriptionPlanRequest } from '@/features/admin-orders/data/requests_models/createSubscriptionPlanRequest'
import type { UpdateSubscriptionPlanRequest } from '@/features/admin-orders/data/requests_models/updateSubscriptionPlanRequest'
import type { CreateProviderInstanceRequest } from '@/features/admin-orders/data/requests_models/createProviderInstanceRequest'
import type { UpdateProviderInstanceRequest } from '@/features/admin-orders/data/requests_models/updateProviderInstanceRequest'

export interface AdminOrdersActionRepository {
  updateConfig(req: UpdatePaymentConfigRequest): Promise<AdminPaymentConfig>
  cancelOrder(id: number): Promise<{ message: string }>
  retryRecharge(id: number): Promise<{ message: string }>
  refundOrder(id: number, req: RefundOrderRequest): Promise<RefundResult>
  queryRefund(id: number): Promise<RefundResult>
  createPlan(req: CreateSubscriptionPlanRequest): Promise<SubscriptionPlan>
  updatePlan(id: number, req: UpdateSubscriptionPlanRequest): Promise<SubscriptionPlan>
  deletePlan(id: number): Promise<{ message: string }>
  createProvider(req: CreateProviderInstanceRequest): Promise<ProviderInstance>
  updateProvider(id: number, req: UpdateProviderInstanceRequest): Promise<ProviderInstance>
  deleteProvider(id: number): Promise<{ message: string }>
}
