/* Auto-generated identity Mapper. Replace when Dto/Entity diverge. */
import type {
  BatchUserAttributesResponse
} from '@/features/admin-users/data/datasources/userAttributesDatasource'

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toBatchUserAttributesResponse = (dto: BatchUserAttributesResponse): BatchUserAttributesResponse => dto
export const batchUserAttributesResponseToDto = (entity: BatchUserAttributesResponse): BatchUserAttributesResponse => entity
