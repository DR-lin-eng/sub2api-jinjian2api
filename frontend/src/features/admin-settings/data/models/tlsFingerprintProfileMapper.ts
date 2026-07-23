/* Auto-generated identity Mapper. Replace when Dto/Entity diverge. */
import type {
  TLSFingerprintProfile,
  CreateProfileRequest,
  UpdateProfileRequest
} from '@/features/admin-settings/data/datasources/tlsFingerprintProfileDatasource'

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toTLSFingerprintProfile = (dto: TLSFingerprintProfile): TLSFingerprintProfile => dto
export const tLSFingerprintProfileToDto = (entity: TLSFingerprintProfile): TLSFingerprintProfile => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toCreateProfileRequest = (dto: CreateProfileRequest): CreateProfileRequest => dto
export const createProfileRequestToDto = (entity: CreateProfileRequest): CreateProfileRequest => entity

/** Identity mapper: Dto === Entity until field names diverge (spec §5.3). */
export const toUpdateProfileRequest = (dto: UpdateProfileRequest): UpdateProfileRequest => dto
export const updateProfileRequestToDto = (entity: UpdateProfileRequest): UpdateProfileRequest => entity
