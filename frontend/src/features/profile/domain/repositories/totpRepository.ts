/**
 * TotpRepository (interface). Auto-generated from totpDatasource.ts by .tmp_gen_repo.mjs.
 * Per spec §5.2 R4: presentation depends on this interface; data/repositories/totpRepositoryImpl is the ONLY code that may call the datasource.
 */
import type * as ds from '@/features/profile/data/datasources/totpDatasource'

export type TotpRepository = {
  getStatus: typeof ds.getStatus
  getVerificationMethod: typeof ds.getVerificationMethod
  sendVerifyCode: typeof ds.sendVerifyCode
  initiateSetup: typeof ds.initiateSetup
  enable: typeof ds.enable
  disable: typeof ds.disable
  stepUp: typeof ds.stepUp
}
