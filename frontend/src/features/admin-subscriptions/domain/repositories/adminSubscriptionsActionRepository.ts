import type { UserSubscription } from '@/core/models/domain/userSubscription'
import type { AssignSubscriptionRequest } from '@/features/admin-subscriptions/data/requests_models/assignSubscriptionRequest'
import type { BulkAssignSubscriptionRequest } from '@/features/admin-subscriptions/data/requests_models/bulkAssignSubscriptionRequest'
import type { ExtendSubscriptionRequest } from '@/features/admin-subscriptions/data/requests_models/extendSubscriptionRequest'
import type { ResetSubscriptionQuotaRequest } from '@/features/admin-subscriptions/data/requests_models/resetSubscriptionQuotaRequest'

export interface AdminSubscriptionsActionRepository {
  assign(req: AssignSubscriptionRequest): Promise<UserSubscription>
  bulkAssign(req: BulkAssignSubscriptionRequest): Promise<UserSubscription[]>
  extend(id: number, req: ExtendSubscriptionRequest): Promise<UserSubscription>
  revoke(id: number): Promise<{ message: string }>
  restore(id: number): Promise<UserSubscription>
  resetQuota(id: number, req: ResetSubscriptionQuotaRequest): Promise<UserSubscription>
}
