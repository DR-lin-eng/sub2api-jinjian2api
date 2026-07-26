import { totpQueryDatasource } from '@/features/profile/data/datasources/totpQueryDatasource'
import type { TotpQueryRepository } from '@/features/profile/domain/repositories/totpQueryRepository'
import type { TotpStatus } from '@/features/profile/domain/models/totpStatus'
import type { TotpVerificationMethod } from '@/features/profile/domain/models/totpVerificationMethod'

class TotpQueryRepositoryImpl implements TotpQueryRepository {
  getStatus = async () : Promise<TotpStatus>  => {
    return (await totpQueryDatasource.getStatus()).toEntity()
  }

  getVerificationMethod = async () : Promise<TotpVerificationMethod>  => {
    return (await totpQueryDatasource.getVerificationMethod()).toEntity()
  }
}

export const totpQueryRepository: TotpQueryRepository = new TotpQueryRepositoryImpl()
