/* Auto-generated identity Mapper. Replace when Dto/Entity diverge. */
import type {
  TotpStepUpResponse
} from '@/features/profile/data/datasources/totpDatasource'

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toTotpStepUpResponse = (dto: TotpStepUpResponse): TotpStepUpResponse => dto
export const totpStepUpResponseToDto = (entity: TotpStepUpResponse): TotpStepUpResponse => entity
