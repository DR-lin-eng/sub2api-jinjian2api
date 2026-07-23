import { apiClient } from '@/core/networks/client'
import { AdminPaymentConfigDto } from '@/features/admin-orders/data/models/adminPaymentConfigDto'
import { SubscriptionPlanDto } from '@/features/admin-orders/data/models/subscriptionPlanDto'
import { ProviderInstanceDto } from '@/features/admin-orders/data/models/providerInstanceDto'
import { RefundResultDto } from '@/features/admin-orders/data/models/refundResultDto'
import type { UpdatePaymentConfigRequest } from '@/features/admin-orders/data/requests_models/updatePaymentConfigRequest'
import type { RefundOrderRequest } from '@/features/admin-orders/data/requests_models/refundOrderRequest'
import type { CreateSubscriptionPlanRequest } from '@/features/admin-orders/data/requests_models/createSubscriptionPlanRequest'
import type { UpdateSubscriptionPlanRequest } from '@/features/admin-orders/data/requests_models/updateSubscriptionPlanRequest'
import type { CreateProviderInstanceRequest } from '@/features/admin-orders/data/requests_models/createProviderInstanceRequest'
import type { UpdateProviderInstanceRequest } from '@/features/admin-orders/data/requests_models/updateProviderInstanceRequest'

export class AdminOrdersActionDatasource {
  async updateConfig(req: UpdatePaymentConfigRequest): Promise<AdminPaymentConfigDto> {
    const { data } = await apiClient.put<unknown>('/admin/payment/config', req)
    return AdminPaymentConfigDto.fromJson(data)
  }

  async cancelOrder(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>(`/admin/payment/orders/${id}/cancel`)
    return data
  }

  async retryRecharge(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>(`/admin/payment/orders/${id}/retry`)
    return data
  }

  async refundOrder(id: number, req: RefundOrderRequest): Promise<RefundResultDto> {
    const { data } = await apiClient.post<unknown>(`/admin/payment/orders/${id}/refund`, req)
    return RefundResultDto.fromJson(data)
  }

  async queryRefund(id: number): Promise<RefundResultDto> {
    const { data } = await apiClient.post<unknown>(`/admin/payment/orders/${id}/refund/query`)
    return RefundResultDto.fromJson(data)
  }

  async createPlan(req: CreateSubscriptionPlanRequest): Promise<SubscriptionPlanDto> {
    const { data } = await apiClient.post<unknown>('/admin/payment/plans', req)
    return SubscriptionPlanDto.fromJson(data)
  }

  async updatePlan(id: number, req: UpdateSubscriptionPlanRequest): Promise<SubscriptionPlanDto> {
    const { data } = await apiClient.put<unknown>(`/admin/payment/plans/${id}`, req)
    return SubscriptionPlanDto.fromJson(data)
  }

  async deletePlan(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/payment/plans/${id}`)
    return data
  }

  async createProvider(req: CreateProviderInstanceRequest): Promise<ProviderInstanceDto> {
    const { data } = await apiClient.post<unknown>('/admin/payment/providers', req)
    return ProviderInstanceDto.fromJson(data)
  }

  async updateProvider(id: number, req: UpdateProviderInstanceRequest): Promise<ProviderInstanceDto> {
    const { data } = await apiClient.put<unknown>(`/admin/payment/providers/${id}`, req)
    return ProviderInstanceDto.fromJson(data)
  }

  async deleteProvider(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/payment/providers/${id}`)
    return data
  }
}

export const adminOrdersActionDatasource = new AdminOrdersActionDatasource()
