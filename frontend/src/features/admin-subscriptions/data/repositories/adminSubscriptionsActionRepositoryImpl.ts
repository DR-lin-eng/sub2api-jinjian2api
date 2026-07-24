import { adminSubscriptionsActionDatasource } from '@/features/admin-subscriptions/data/datasources/adminSubscriptionsActionDatasource'
import type { AdminSubscriptionsActionRepository } from '@/features/admin-subscriptions/domain/repositories/adminSubscriptionsActionRepository'
import type { UserSubscription } from '@/core/models/domain/userSubscription'
import type { AssignSubscriptionRequest } from '@/features/admin-subscriptions/data/requests_models/assignSubscriptionRequest'
import type { BulkAssignSubscriptionRequest } from '@/features/admin-subscriptions/data/requests_models/bulkAssignSubscriptionRequest'
import type { ExtendSubscriptionRequest } from '@/features/admin-subscriptions/data/requests_models/extendSubscriptionRequest'
import type { ResetSubscriptionQuotaRequest } from '@/features/admin-subscriptions/data/requests_models/resetSubscriptionQuotaRequest'

class AdminSubscriptionsActionRepositoryImpl implements AdminSubscriptionsActionRepository {
  private readonly ds = adminSubscriptionsActionDatasource

  async assign(req: AssignSubscriptionRequest): Promise<UserSubscription> {
    return (await this.ds.assign(req)).toEntity()
  }

  async bulkAssign(req: BulkAssignSubscriptionRequest): Promise<UserSubscription[]> {
    return (await this.ds.bulkAssign(req)).map(dto => dto.toEntity())
  }

  async extend(id: number, req: ExtendSubscriptionRequest): Promise<UserSubscription> {
    return (await this.ds.extend(id, req)).toEntity()
  }

  async revoke(id: number): Promise<{ message: string }> {
    return this.ds.revoke(id)
  }

  async restore(id: number): Promise<UserSubscription> {
    return (await this.ds.restore(id)).toEntity()
  }

  async resetQuota(id: number, req: ResetSubscriptionQuotaRequest): Promise<UserSubscription> {
    return (await this.ds.resetQuota(id, req)).toEntity()
  }
}

export const adminSubscriptionsActionRepository: AdminSubscriptionsActionRepository =
  new AdminSubscriptionsActionRepositoryImpl()
