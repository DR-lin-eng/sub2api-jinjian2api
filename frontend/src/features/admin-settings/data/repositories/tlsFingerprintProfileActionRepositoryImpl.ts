import { tlsFingerprintProfileActionDatasource } from '@/features/admin-settings/data/datasources/tlsFingerprintProfileActionDatasource'
import type { TlsFingerprintProfileActionRepository } from '@/features/admin-settings/domain/repositories/tlsFingerprintProfileActionRepository'
import type { TlsFingerprintProfile } from '@/features/admin-settings/domain/models/tlsFingerprintProfile'
import type { CreateTlsFingerprintProfileRequest } from '@/features/admin-settings/data/requests_models/createTlsFingerprintProfileRequest'
import type { UpdateTlsFingerprintProfileRequest } from '@/features/admin-settings/data/requests_models/updateTlsFingerprintProfileRequest'

class TlsFingerprintProfileActionRepositoryImpl implements TlsFingerprintProfileActionRepository {
  private readonly ds = tlsFingerprintProfileActionDatasource

  create = async (req: CreateTlsFingerprintProfileRequest) : Promise<TlsFingerprintProfile>  => {
    return (await this.ds.create(req)).toEntity()
  }

  update = async (id: number, req: UpdateTlsFingerprintProfileRequest) : Promise<TlsFingerprintProfile>  => {
    return (await this.ds.update(id, req)).toEntity()
  }

  deleteProfile = async (id: number) : Promise<{ message: string }>  => {
    return this.ds.deleteProfile(id)
  }
}

export const tlsFingerprintProfileActionRepository: TlsFingerprintProfileActionRepository = new TlsFingerprintProfileActionRepositoryImpl()
