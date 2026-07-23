/* Auto-generated identity Mapper. Replace when Dto/Entity diverge. */
import type {
  ErrorPassthroughRule,
  CreateRuleRequest,
  UpdateRuleRequest
} from '@/features/admin-settings/data/datasources/errorPassthroughDatasource'

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toErrorPassthroughRule = (dto: ErrorPassthroughRule): ErrorPassthroughRule => dto
export const errorPassthroughRuleToDto = (entity: ErrorPassthroughRule): ErrorPassthroughRule => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toCreateRuleRequest = (dto: CreateRuleRequest): CreateRuleRequest => dto
export const createRuleRequestToDto = (entity: CreateRuleRequest): CreateRuleRequest => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUpdateRuleRequest = (dto: UpdateRuleRequest): UpdateRuleRequest => dto
export const updateRuleRequestToDto = (entity: UpdateRuleRequest): UpdateRuleRequest => entity
