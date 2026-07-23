/* Auto-generated identity Mapper. Replace when Dto/Entity diverge. */
import type {
  PublicOrderVerifyResult
} from '@/features/billing/data/datasources/paymentDatasource'

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toPublicOrderVerifyResult = (dto: PublicOrderVerifyResult): PublicOrderVerifyResult => dto
export const publicOrderVerifyResultToDto = (entity: PublicOrderVerifyResult): PublicOrderVerifyResult => entity
