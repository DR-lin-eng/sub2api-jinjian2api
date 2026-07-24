import { tlsFingerprintProfileQueryDatasource } from '@/features/admin-settings/data/datasources/tlsFingerprintProfileQueryDatasource'
import type { TlsFingerprintProfileQueryRepository } from '@/features/admin-settings/domain/repositories/tlsFingerprintProfileQueryRepository'
import type { TlsFingerprintProfile } from '@/features/admin-settings/domain/models/tlsFingerprintProfile'

class TlsFingerprintProfileQueryRepositoryImpl implements TlsFingerprintProfileQueryRepository {
  private readonly ds = tlsFingerprintProfileQueryDatasource

  async list(): Promise<TlsFingerprintProfile[]> {
    return (await this.ds.list()).map(dto => dto.toEntity())
  }

  async getById(id: number): Promise<TlsFingerprintProfile> {
    return (await this.ds.getById(id)).toEntity()
  }
}

export const tlsFingerprintProfileQueryRepository: TlsFingerprintProfileQueryRepository = new TlsFingerprintProfileQueryRepositoryImpl()
