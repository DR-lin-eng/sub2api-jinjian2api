import { tlsFingerprintProfileQueryDatasource } from '@/features/admin-settings/data/datasources/tlsFingerprintProfileQueryDatasource'
import type { TlsFingerprintProfileQueryRepository } from '@/features/admin-settings/domain/repositories/tlsFingerprintProfileQueryRepository'
import type { TlsFingerprintProfile } from '@/features/admin-settings/domain/models/tlsFingerprintProfile'

class TlsFingerprintProfileQueryRepositoryImpl implements TlsFingerprintProfileQueryRepository {
  private readonly ds = tlsFingerprintProfileQueryDatasource

  list = async () : Promise<TlsFingerprintProfile[]>  => {
    return (await this.ds.list()).map(dto => dto.toEntity())
  }

  getById = async (id: number) : Promise<TlsFingerprintProfile>  => {
    return (await this.ds.getById(id)).toEntity()
  }
}

export const tlsFingerprintProfileQueryRepository: TlsFingerprintProfileQueryRepository = new TlsFingerprintProfileQueryRepositoryImpl()
