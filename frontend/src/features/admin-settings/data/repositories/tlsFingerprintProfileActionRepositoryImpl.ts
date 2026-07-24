import { tlsFingerprintProfileActionDatasource } from '@/features/admin-settings/data/datasources/tlsFingerprintProfileActionDatasource'
import type { TlsFingerprintProfileActionRepository } from '@/features/admin-settings/domain/repositories/tlsFingerprintProfileActionRepository'
import type { TlsFingerprintProfile } from '@/features/admin-settings/domain/models/tlsFingerprintProfile'
import type { CreateTlsFingerprintProfileRequest } from '@/features/admin-settings/data/requests_models/createTlsFingerprintProfileRequest'
import type { UpdateTlsFingerprintProfileRequest } from '@/features/admin-settings/data/requests_models/updateTlsFingerprintProfileRequest'

class TlsFingerprintProfileActionRepositoryImpl implements TlsFingerprintProfileActionRepository {
  private readonly ds = tlsFingerprintProfileActionDatasource

  async create(req: CreateTlsFingerprintProfileRequest): Promise<TlsFingerprintProfile> {
    return (await this.ds.create(req)).toEntity()
  }

  async update(id: number, req: UpdateTlsFingerprintProfileRequest): Promise<TlsFingerprintProfile> {
    return (await this.ds.update(id, req)).toEntity()
  }

  async deleteProfile(id: number): Promise<{ message: string }> {
    return this.ds.deleteProfile(id)
  }
}

export const tlsFingerprintProfileActionRepository: TlsFingerprintProfileActionRepository = new TlsFingerprintProfileActionRepositoryImpl()
