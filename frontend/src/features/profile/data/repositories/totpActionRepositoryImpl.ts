import { totpActionDatasource } from '@/features/profile/data/datasources/totpActionDatasource'
import type { TotpActionRepository } from '@/features/profile/domain/repositories/totpActionRepository'
import type { TotpSetupResponse } from '@/features/profile/domain/models/totpSetupResponse'
import type { TotpEnableResponse } from '@/features/profile/domain/models/totpEnableResponse'
import type { TotpStepUpResponse } from '@/features/profile/domain/models/totpStepUpResponse'
import type { TotpSetupRequest } from '@/features/profile/data/requests_models/totpSetupRequest'
import type { TotpEnableRequest } from '@/features/profile/data/requests_models/totpEnableRequest'
import type { TotpDisableRequest } from '@/features/profile/data/requests_models/totpDisableRequest'

class TotpActionRepositoryImpl implements TotpActionRepository {
  sendVerifyCode = async () : Promise<{ success: boolean }>  => {
    return totpActionDatasource.sendVerifyCode()
  }

  initiateSetup = async (req?: TotpSetupRequest) : Promise<TotpSetupResponse>  => {
    return (await totpActionDatasource.initiateSetup(req)).toEntity()
  }

  enable = async (req: TotpEnableRequest) : Promise<TotpEnableResponse>  => {
    return (await totpActionDatasource.enable(req)).toEntity()
  }

  disable = async (req: TotpDisableRequest) : Promise<{ success: boolean }>  => {
    return totpActionDatasource.disable(req)
  }

  stepUp = async (code: string) : Promise<TotpStepUpResponse>  => {
    return (await totpActionDatasource.stepUp(code)).toEntity()
  }
}

export const totpActionRepository: TotpActionRepository = new TotpActionRepositoryImpl()
