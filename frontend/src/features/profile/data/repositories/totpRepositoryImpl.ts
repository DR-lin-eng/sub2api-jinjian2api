/**
 * TotpRepositoryImpl. Auto-generated from totpDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/profile/data/datasources/totpDatasource'
import type { TotpRepository } from '@/features/profile/domain/repositories/totpRepository'

export class TotpRepositoryImpl implements TotpRepository {
  get getStatus(): typeof ds.getStatus { return ds.getStatus }
  get getVerificationMethod(): typeof ds.getVerificationMethod { return ds.getVerificationMethod }
  get sendVerifyCode(): typeof ds.sendVerifyCode { return ds.sendVerifyCode }
  get initiateSetup(): typeof ds.initiateSetup { return ds.initiateSetup }
  get enable(): typeof ds.enable { return ds.enable }
  get disable(): typeof ds.disable { return ds.disable }
  get stepUp(): typeof ds.stepUp { return ds.stepUp }
}

export const totpRepository: TotpRepository = new TotpRepositoryImpl()
