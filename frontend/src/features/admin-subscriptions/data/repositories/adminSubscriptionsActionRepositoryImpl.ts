import { adminSubscriptionsActionDatasource } from '@/features/admin-subscriptions/data/datasources/adminSubscriptionsActionDatasource'
import type { AdminSubscriptionsActionRepository } from '@/features/admin-subscriptions/domain/repositories/adminSubscriptionsActionRepository'
import type { UserSubscription } from '@/core/models/domain/userSubscription'
import type { AssignSubscriptionRequest } from '@/features/admin-subscriptions/data/requests_models/assignSubscriptionRequest'
import type { BulkAssignSubscriptionRequest } from '@/features/admin-subscriptions/data/requests_models/bulkAssignSubscriptionRequest'
import type { ExtendSubscriptionRequest } from '@/features/admin-subscriptions/data/requests_models/extendSubscriptionRequest'
import type { ResetSubscriptionQuotaRequest } from '@/features/admin-subscriptions/data/requests_models/resetSubscriptionQuotaRequest'

class AdminSubscriptionsActionRepositoryImpl implements AdminSubscriptionsActionRepository {
  private readonly ds = adminSubscriptionsActionDatasource

  assign = async (req: AssignSubscriptionRequest) : Promise<UserSubscription>  => {
    return (await this.ds.assign(req)).toEntity()
  }

  bulkAssign = async (req: BulkAssignSubscriptionRequest) : Promise<UserSubscription[]>  => {
    return (await this.ds.bulkAssign(req)).map(dto => dto.toEntity())
  }

  extend = async (id: number, req: ExtendSubscriptionRequest) : Promise<UserSubscription>  => {
    return (await this.ds.extend(id, req)).toEntity()
  }

  revoke = async (id: number) : Promise<{ message: string }>  => {
    return this.ds.revoke(id)
  }

  restore = async (id: number) : Promise<UserSubscription>  => {
    return (await this.ds.restore(id)).toEntity()
  }

  resetQuota = async (id: number, req: ResetSubscriptionQuotaRequest) : Promise<UserSubscription>  => {
    return (await this.ds.resetQuota(id, req)).toEntity()
  }
}

export const adminSubscriptionsActionRepository: AdminSubscriptionsActionRepository =
  new AdminSubscriptionsActionRepositoryImpl()
