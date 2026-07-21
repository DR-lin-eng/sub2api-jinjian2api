/**
 * TotpRepository (interface). Auto-generated from totpDatasource.ts.
 */
import type * as ds from '@/features/profile/data/datasources/totpDatasource'

export type TotpRepository = {
  readonly getStatus: typeof ds.getStatus
  readonly getVerificationMethod: typeof ds.getVerificationMethod
  readonly sendVerifyCode: typeof ds.sendVerifyCode
  readonly initiateSetup: typeof ds.initiateSetup
  readonly enable: typeof ds.enable
  readonly disable: typeof ds.disable
  readonly stepUp: typeof ds.stepUp
}
