import type { TlsFingerprintProfile } from '@/features/admin-settings/domain/models/tlsFingerprintProfile'
import type { CreateTlsFingerprintProfileRequest } from '@/features/admin-settings/data/requests_models/createTlsFingerprintProfileRequest'
import type { UpdateTlsFingerprintProfileRequest } from '@/features/admin-settings/data/requests_models/updateTlsFingerprintProfileRequest'

export interface TlsFingerprintProfileActionRepository {
  create(req: CreateTlsFingerprintProfileRequest): Promise<TlsFingerprintProfile>
  update(id: number, req: UpdateTlsFingerprintProfileRequest): Promise<TlsFingerprintProfile>
  deleteProfile(id: number): Promise<{ message: string }>
}
