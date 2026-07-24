import { subscriptionsQueryDatasource } from '@/features/subscriptions/data/datasources/subscriptionsQueryDatasource'
import type { SubscriptionsQueryRepository } from '@/features/subscriptions/domain/repositories/subscriptionsQueryRepository'
import type { UserSubscription } from '@/core/models/domain/userSubscription'
import type { SubscriptionProgress } from '@/features/admin-subscriptions/domain/models/subscriptionProgress'
import type { SubscriptionSummary } from '@/features/subscriptions/domain/models/subscriptionSummary'

class SubscriptionsQueryRepositoryImpl implements SubscriptionsQueryRepository {
  private readonly ds = subscriptionsQueryDatasource

  async list(): Promise<UserSubscription[]> {
    return (await this.ds.list()).map(dto => dto.toEntity())
  }

  async listActive(): Promise<UserSubscription[]> {
    return (await this.ds.listActive()).map(dto => dto.toEntity())
  }

  async listProgress(): Promise<SubscriptionProgress[]> {
    return (await this.ds.listProgress()).map(dto => dto.toEntity())
  }

  async getSummary(): Promise<SubscriptionSummary> {
    return (await this.ds.getSummary()).toEntity()
  }

  async getProgress(subscriptionId: number): Promise<SubscriptionProgress> {
    return (await this.ds.getProgress(subscriptionId)).toEntity()
  }
}

export const subscriptionsQueryRepository: SubscriptionsQueryRepository = new SubscriptionsQueryRepositoryImpl()
