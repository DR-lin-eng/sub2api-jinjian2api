/* Auto-generated identity Mapper. Replace when Dto/Entity diverge. */
import type {
  ModerationMode,
  KeywordBlockingMode,
  ContentModerationModelFilterType,
  ContentModerationModelFilter,
  ContentModerationConfig,
  ContentModerationAPIKeyStatusValue,
  ContentModerationAPIKeyStatus,
  TestContentModerationAPIKeysPayload,
  TestContentModerationAPIKeysResponse,
  ContentModerationTestAuditResult,
  UpdateContentModerationConfig,
  ContentModerationRuntimeStatus,
  ContentModerationAPIKeyLoad,
  ContentModerationLog,
  ListContentModerationLogsParams,
  ContentModerationLogsResponse,
  ContentModerationUnbanUserResponse,
  DeleteFlaggedHashResponse,
  ClearFlaggedHashesResponse
} from '@/features/admin-risk-control/data/datasources/adminRiskControlDatasource'

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toModerationMode = (dto: ModerationMode): ModerationMode => dto
export const moderationModeToDto = (entity: ModerationMode): ModerationMode => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toKeywordBlockingMode = (dto: KeywordBlockingMode): KeywordBlockingMode => dto
export const keywordBlockingModeToDto = (entity: KeywordBlockingMode): KeywordBlockingMode => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toContentModerationModelFilterType = (dto: ContentModerationModelFilterType): ContentModerationModelFilterType => dto
export const contentModerationModelFilterTypeToDto = (entity: ContentModerationModelFilterType): ContentModerationModelFilterType => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toContentModerationModelFilter = (dto: ContentModerationModelFilter): ContentModerationModelFilter => dto
export const contentModerationModelFilterToDto = (entity: ContentModerationModelFilter): ContentModerationModelFilter => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toContentModerationConfig = (dto: ContentModerationConfig): ContentModerationConfig => dto
export const contentModerationConfigToDto = (entity: ContentModerationConfig): ContentModerationConfig => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toContentModerationAPIKeyStatusValue = (dto: ContentModerationAPIKeyStatusValue): ContentModerationAPIKeyStatusValue => dto
export const contentModerationAPIKeyStatusValueToDto = (entity: ContentModerationAPIKeyStatusValue): ContentModerationAPIKeyStatusValue => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toContentModerationAPIKeyStatus = (dto: ContentModerationAPIKeyStatus): ContentModerationAPIKeyStatus => dto
export const contentModerationAPIKeyStatusToDto = (entity: ContentModerationAPIKeyStatus): ContentModerationAPIKeyStatus => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toTestContentModerationAPIKeysPayload = (dto: TestContentModerationAPIKeysPayload): TestContentModerationAPIKeysPayload => dto
export const testContentModerationAPIKeysPayloadToDto = (entity: TestContentModerationAPIKeysPayload): TestContentModerationAPIKeysPayload => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toTestContentModerationAPIKeysResponse = (dto: TestContentModerationAPIKeysResponse): TestContentModerationAPIKeysResponse => dto
export const testContentModerationAPIKeysResponseToDto = (entity: TestContentModerationAPIKeysResponse): TestContentModerationAPIKeysResponse => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toContentModerationTestAuditResult = (dto: ContentModerationTestAuditResult): ContentModerationTestAuditResult => dto
export const contentModerationTestAuditResultToDto = (entity: ContentModerationTestAuditResult): ContentModerationTestAuditResult => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUpdateContentModerationConfig = (dto: UpdateContentModerationConfig): UpdateContentModerationConfig => dto
export const updateContentModerationConfigToDto = (entity: UpdateContentModerationConfig): UpdateContentModerationConfig => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toContentModerationRuntimeStatus = (dto: ContentModerationRuntimeStatus): ContentModerationRuntimeStatus => dto
export const contentModerationRuntimeStatusToDto = (entity: ContentModerationRuntimeStatus): ContentModerationRuntimeStatus => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toContentModerationAPIKeyLoad = (dto: ContentModerationAPIKeyLoad): ContentModerationAPIKeyLoad => dto
export const contentModerationAPIKeyLoadToDto = (entity: ContentModerationAPIKeyLoad): ContentModerationAPIKeyLoad => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toContentModerationLog = (dto: ContentModerationLog): ContentModerationLog => dto
export const contentModerationLogToDto = (entity: ContentModerationLog): ContentModerationLog => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toListContentModerationLogsParams = (dto: ListContentModerationLogsParams): ListContentModerationLogsParams => dto
export const listContentModerationLogsParamsToDto = (entity: ListContentModerationLogsParams): ListContentModerationLogsParams => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toContentModerationLogsResponse = (dto: ContentModerationLogsResponse): ContentModerationLogsResponse => dto
export const contentModerationLogsResponseToDto = (entity: ContentModerationLogsResponse): ContentModerationLogsResponse => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toContentModerationUnbanUserResponse = (dto: ContentModerationUnbanUserResponse): ContentModerationUnbanUserResponse => dto
export const contentModerationUnbanUserResponseToDto = (entity: ContentModerationUnbanUserResponse): ContentModerationUnbanUserResponse => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toDeleteFlaggedHashResponse = (dto: DeleteFlaggedHashResponse): DeleteFlaggedHashResponse => dto
export const deleteFlaggedHashResponseToDto = (entity: DeleteFlaggedHashResponse): DeleteFlaggedHashResponse => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toClearFlaggedHashesResponse = (dto: ClearFlaggedHashesResponse): ClearFlaggedHashesResponse => dto
export const clearFlaggedHashesResponseToDto = (entity: ClearFlaggedHashesResponse): ClearFlaggedHashesResponse => entity
