/* Auto-generated identity Mapper. Replace when Dto/Entity diverge. */
import type {
  AdminUsageStatsResponse,
  SimpleUser,
  SimpleApiKey,
  UsageCleanupFilters,
  UsageCleanupTask,
  CreateUsageCleanupTaskRequest,
  AdminUsageQueryParams
} from '@/features/admin-usage/data/datasources/adminUsageDatasource'

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toAdminUsageStatsResponse = (dto: AdminUsageStatsResponse): AdminUsageStatsResponse => dto
export const adminUsageStatsResponseToDto = (entity: AdminUsageStatsResponse): AdminUsageStatsResponse => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toSimpleUser = (dto: SimpleUser): SimpleUser => dto
export const simpleUserToDto = (entity: SimpleUser): SimpleUser => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toSimpleApiKey = (dto: SimpleApiKey): SimpleApiKey => dto
export const simpleApiKeyToDto = (entity: SimpleApiKey): SimpleApiKey => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUsageCleanupFilters = (dto: UsageCleanupFilters): UsageCleanupFilters => dto
export const usageCleanupFiltersToDto = (entity: UsageCleanupFilters): UsageCleanupFilters => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUsageCleanupTask = (dto: UsageCleanupTask): UsageCleanupTask => dto
export const usageCleanupTaskToDto = (entity: UsageCleanupTask): UsageCleanupTask => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toCreateUsageCleanupTaskRequest = (dto: CreateUsageCleanupTaskRequest): CreateUsageCleanupTaskRequest => dto
export const createUsageCleanupTaskRequestToDto = (entity: CreateUsageCleanupTaskRequest): CreateUsageCleanupTaskRequest => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toAdminUsageQueryParams = (dto: AdminUsageQueryParams): AdminUsageQueryParams => dto
export const adminUsageQueryParamsToDto = (entity: AdminUsageQueryParams): AdminUsageQueryParams => entity
