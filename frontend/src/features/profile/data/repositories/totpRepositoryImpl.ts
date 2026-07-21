/**
 * TotpRepositoryImpl. Auto-generated from totpDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/profile/data/datasources/totpDatasource'
import type { TotpRepository } from '@/features/profile/domain/repositories/totpRepository'

export class TotpRepositoryImpl implements TotpRepository {
  getStatus = ds.getStatus
  getVerificationMethod = ds.getVerificationMethod
  sendVerifyCode = ds.sendVerifyCode
  initiateSetup = ds.initiateSetup
  enable = ds.enable
  disable = ds.disable
  stepUp = ds.stepUp
}

export const totpRepository: TotpRepository = new TotpRepositoryImpl()
