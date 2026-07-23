/* Auto-generated identity Mapper. Replace when Dto/Entity diverge. */
import type {
  SubscriptionSummary
} from '@/features/subscriptions/data/datasources/subscriptionsDatasource'

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toSubscriptionSummary = (dto: SubscriptionSummary): SubscriptionSummary => dto
export const subscriptionSummaryToDto = (entity: SubscriptionSummary): SubscriptionSummary => entity
