import type { AdminOrdersActionRepository } from '@/features/admin-orders/domain/repositories/adminOrdersActionRepository'
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
import { adminOrdersActionDatasource } from '@/features/admin-orders/data/datasources/adminOrdersActionDatasource'

export class AdminOrdersActionRepositoryImpl implements AdminOrdersActionRepository {
  private readonly ds = adminOrdersActionDatasource

  async updateConfig(req: UpdatePaymentConfigRequest): Promise<AdminPaymentConfig> {
    return (await this.ds.updateConfig(req)).toEntity()
  }

  async cancelOrder(id: number): Promise<{ message: string }> {
    return this.ds.cancelOrder(id)
  }

  async retryRecharge(id: number): Promise<{ message: string }> {
    return this.ds.retryRecharge(id)
  }

  async refundOrder(id: number, req: RefundOrderRequest): Promise<RefundResult> {
    return (await this.ds.refundOrder(id, req)).toEntity()
  }

  async queryRefund(id: number): Promise<RefundResult> {
    return (await this.ds.queryRefund(id)).toEntity()
  }

  async createPlan(req: CreateSubscriptionPlanRequest): Promise<SubscriptionPlan> {
    return (await this.ds.createPlan(req)).toEntity()
  }

  async updatePlan(id: number, req: UpdateSubscriptionPlanRequest): Promise<SubscriptionPlan> {
    return (await this.ds.updatePlan(id, req)).toEntity()
  }

  async deletePlan(id: number): Promise<{ message: string }> {
    return this.ds.deletePlan(id)
  }

  async createProvider(req: CreateProviderInstanceRequest): Promise<ProviderInstance> {
    return (await this.ds.createProvider(req)).toEntity()
  }

  async updateProvider(id: number, req: UpdateProviderInstanceRequest): Promise<ProviderInstance> {
    return (await this.ds.updateProvider(id, req)).toEntity()
  }

  async deleteProvider(id: number): Promise<{ message: string }> {
    return this.ds.deleteProvider(id)
  }
}

export const adminOrdersActionRepository: AdminOrdersActionRepository = new AdminOrdersActionRepositoryImpl()
