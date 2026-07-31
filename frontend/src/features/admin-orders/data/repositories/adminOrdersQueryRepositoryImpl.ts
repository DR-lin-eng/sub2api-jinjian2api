import type { AdminOrdersQueryRepository } from '@/features/admin-orders/domain/repositories/adminOrdersQueryRepository'
import type { AdminPaymentConfig } from '@/features/admin-orders/domain/models/adminPaymentConfig'
import type { DashboardStats } from '@/features/admin-orders/domain/models/dashboardStats'
import type { PaymentOrder } from '@/features/admin-orders/domain/models/paymentOrder'
import type { SubscriptionPlan } from '@/features/admin-orders/domain/models/subscriptionPlan'
import type { ProviderInstance } from '@/features/admin-orders/domain/models/providerInstance'
import type { GetOrdersRequest } from '@/features/admin-orders/data/requests_models/getOrdersRequest'
import type { PaginatedResponse } from '@/core/networks/paginatedResponse'
import { adminOrdersQueryDatasource } from '@/features/admin-orders/data/datasources/adminOrdersQueryDatasource'

export class AdminOrdersQueryRepositoryImpl implements AdminOrdersQueryRepository {
  private readonly ds = adminOrdersQueryDatasource

  getConfig = async () : Promise<AdminPaymentConfig>  => {
    return (await this.ds.getConfig()).toEntity()
  }

  getDashboard = async (days?: number) : Promise<DashboardStats>  => {
    return (await this.ds.getDashboard(days)).toEntity()
  }

  getOrders = async (req?: GetOrdersRequest) : Promise<PaginatedResponse<PaymentOrder>>  => {
    const result = await this.ds.getOrders(req)
    return {
      ...result,
      items: result.items.map(dto => dto.toEntity()),
    }
  }

  getOrder = async (id: number) : Promise<unknown>  => {
    return this.ds.getOrder(id)
  }

  getPlans = async () : Promise<SubscriptionPlan[]>  => {
    return (await this.ds.getPlans()).map(dto => dto.toEntity())
  }

  getProviders = async () : Promise<ProviderInstance[]>  => {
    return (await this.ds.getProviders()).map(dto => dto.toEntity())
  }
}

export const adminOrdersQueryRepository: AdminOrdersQueryRepository = new AdminOrdersQueryRepositoryImpl()
