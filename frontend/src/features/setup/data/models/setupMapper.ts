/* Auto-generated identity Mapper. Replace when Dto/Entity diverge. */
import type {
  SetupStatus,
  DatabaseConfig,
  RedisConfig,
  AdminConfig,
  ServerConfig,
  InstallRequest,
  InstallResponse
} from '@/features/setup/data/datasources/setupDatasource'

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toSetupStatus = (dto: SetupStatus): SetupStatus => dto
export const setupStatusToDto = (entity: SetupStatus): SetupStatus => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toDatabaseConfig = (dto: DatabaseConfig): DatabaseConfig => dto
export const databaseConfigToDto = (entity: DatabaseConfig): DatabaseConfig => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toRedisConfig = (dto: RedisConfig): RedisConfig => dto
export const redisConfigToDto = (entity: RedisConfig): RedisConfig => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toAdminConfig = (dto: AdminConfig): AdminConfig => dto
export const adminConfigToDto = (entity: AdminConfig): AdminConfig => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toServerConfig = (dto: ServerConfig): ServerConfig => dto
export const serverConfigToDto = (entity: ServerConfig): ServerConfig => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toInstallRequest = (dto: InstallRequest): InstallRequest => dto
export const installRequestToDto = (entity: InstallRequest): InstallRequest => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toInstallResponse = (dto: InstallResponse): InstallResponse => dto
export const installResponseToDto = (entity: InstallResponse): InstallResponse => entity
