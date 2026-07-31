import { apiClient } from '@/core/networks/client'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { PaymentOrderDto } from '@/features/admin-orders/data/models/paymentOrderDto'
import { DashboardStatsDto } from '@/features/admin-orders/data/models/dashboardStatsDto'
import { AdminPaymentConfigDto } from '@/features/admin-orders/data/models/adminPaymentConfigDto'
import { SubscriptionPlanDto } from '@/features/admin-orders/data/models/subscriptionPlanDto'
import { ProviderInstanceDto } from '@/features/admin-orders/data/models/providerInstanceDto'
import type { GetOrdersRequest } from '@/features/admin-orders/data/requests_models/getOrdersRequest'

export class AdminOrdersQueryDatasource {
  async getConfig(): Promise<AdminPaymentConfigDto> {
    const { data } = await apiClient.get<unknown>('/admin/payment/config')
    return AdminPaymentConfigDto.fromJson(data)
  }

  async getDashboard(days?: number): Promise<DashboardStatsDto> {
    const { data } = await apiClient.get<unknown>('/admin/payment/dashboard', {
      params: days ? { days } : undefined,
    })
    return DashboardStatsDto.fromJson(data)
  }

  async getOrders(req?: GetOrdersRequest): Promise<PaginatedResponse<PaymentOrderDto>> {
    const { data } = await apiClient.get<PaginatedResponse<unknown>>('/admin/payment/orders', {
      params: req,
    })
    return {
      ...data,
      items: (data.items ?? []).map(item => PaymentOrderDto.fromJson(item)),
    }
  }

  async getOrder(id: number): Promise<unknown> {
    const { data } = await apiClient.get<unknown>(`/admin/payment/orders/${id}`)
    return data
  }

  async getPlans(): Promise<SubscriptionPlanDto[]> {
    const { data } = await apiClient.get<unknown[]>('/admin/payment/plans')
    return (data ?? []).map(item => SubscriptionPlanDto.fromJson(item))
  }

  async getProviders(): Promise<ProviderInstanceDto[]> {
    const { data } = await apiClient.get<unknown[]>('/admin/payment/providers')
    return (data ?? []).map(item => ProviderInstanceDto.fromJson(item))
  }
}

export const adminOrdersQueryDatasource = new AdminOrdersQueryDatasource()
