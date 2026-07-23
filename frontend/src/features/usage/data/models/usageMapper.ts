/* Auto-generated identity Mapper. Replace when Dto/Entity diverge. */
import type {
  PlatformDashboardStats,
  UserDashboardStats,
  TrendParams,
  TrendResponse,
  ModelStatsResponse,
  ApiKeyDailyUsagePoint,
  ApiKeyDailyUsageResponse,
  UsageDashboardSnapshotV2Params,
  UsageDashboardSnapshotV2Response,
  BatchApiKeyUsageStats,
  BatchApiKeysUsageResponse
} from '@/features/usage/data/datasources/usageDatasource'

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toPlatformDashboardStats = (dto: PlatformDashboardStats): PlatformDashboardStats => dto
export const platformDashboardStatsToDto = (entity: PlatformDashboardStats): PlatformDashboardStats => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUserDashboardStats = (dto: UserDashboardStats): UserDashboardStats => dto
export const userDashboardStatsToDto = (entity: UserDashboardStats): UserDashboardStats => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toTrendParams = (dto: TrendParams): TrendParams => dto
export const trendParamsToDto = (entity: TrendParams): TrendParams => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toTrendResponse = (dto: TrendResponse): TrendResponse => dto
export const trendResponseToDto = (entity: TrendResponse): TrendResponse => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toModelStatsResponse = (dto: ModelStatsResponse): ModelStatsResponse => dto
export const modelStatsResponseToDto = (entity: ModelStatsResponse): ModelStatsResponse => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toApiKeyDailyUsagePoint = (dto: ApiKeyDailyUsagePoint): ApiKeyDailyUsagePoint => dto
export const apiKeyDailyUsagePointToDto = (entity: ApiKeyDailyUsagePoint): ApiKeyDailyUsagePoint => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toApiKeyDailyUsageResponse = (dto: ApiKeyDailyUsageResponse): ApiKeyDailyUsageResponse => dto
export const apiKeyDailyUsageResponseToDto = (entity: ApiKeyDailyUsageResponse): ApiKeyDailyUsageResponse => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUsageDashboardSnapshotV2Params = (dto: UsageDashboardSnapshotV2Params): UsageDashboardSnapshotV2Params => dto
export const usageDashboardSnapshotV2ParamsToDto = (entity: UsageDashboardSnapshotV2Params): UsageDashboardSnapshotV2Params => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUsageDashboardSnapshotV2Response = (dto: UsageDashboardSnapshotV2Response): UsageDashboardSnapshotV2Response => dto
export const usageDashboardSnapshotV2ResponseToDto = (entity: UsageDashboardSnapshotV2Response): UsageDashboardSnapshotV2Response => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toBatchApiKeyUsageStats = (dto: BatchApiKeyUsageStats): BatchApiKeyUsageStats => dto
export const batchApiKeyUsageStatsToDto = (entity: BatchApiKeyUsageStats): BatchApiKeyUsageStats => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toBatchApiKeysUsageResponse = (dto: BatchApiKeysUsageResponse): BatchApiKeysUsageResponse => dto
export const batchApiKeysUsageResponseToDto = (entity: BatchApiKeysUsageResponse): BatchApiKeysUsageResponse => entity
