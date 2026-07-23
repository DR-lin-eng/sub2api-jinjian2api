/* Auto-generated identity Mapper. Replace when Dto/Entity diverge. */
import type {
  ReleaseInfo,
  VersionInfo,
  UpdateResult,
  RollbackVersionInfo
} from '@/features/admin-settings/data/datasources/systemDatasource'

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toReleaseInfo = (dto: ReleaseInfo): ReleaseInfo => dto
export const releaseInfoToDto = (entity: ReleaseInfo): ReleaseInfo => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toVersionInfo = (dto: VersionInfo): VersionInfo => dto
export const versionInfoToDto = (entity: VersionInfo): VersionInfo => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUpdateResult = (dto: UpdateResult): UpdateResult => dto
export const updateResultToDto = (entity: UpdateResult): UpdateResult => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toRollbackVersionInfo = (dto: RollbackVersionInfo): RollbackVersionInfo => dto
export const rollbackVersionInfoToDto = (entity: RollbackVersionInfo): RollbackVersionInfo => entity
