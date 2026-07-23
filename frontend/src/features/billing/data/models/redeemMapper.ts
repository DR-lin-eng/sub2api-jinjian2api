/* Auto-generated identity Mapper. Replace when Dto/Entity diverge. */
import type {
  RedeemHistoryItem
} from '@/features/billing/data/datasources/redeemDatasource'

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toRedeemHistoryItem = (dto: RedeemHistoryItem): RedeemHistoryItem => dto
export const redeemHistoryItemToDto = (entity: RedeemHistoryItem): RedeemHistoryItem => entity
