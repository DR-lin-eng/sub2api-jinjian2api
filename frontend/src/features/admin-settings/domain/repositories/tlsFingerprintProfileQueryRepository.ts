import type { TlsFingerprintProfile } from '@/features/admin-settings/domain/models/tlsFingerprintProfile'

export interface TlsFingerprintProfileQueryRepository {
  list(): Promise<TlsFingerprintProfile[]>
  getById(id: number): Promise<TlsFingerprintProfile>
}
