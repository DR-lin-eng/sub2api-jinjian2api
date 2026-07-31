import type { TotpSetupResponse } from '@/features/profile/domain/models/totpSetupResponse'
import type { TotpEnableResponse } from '@/features/profile/domain/models/totpEnableResponse'
import type { TotpStepUpResponse } from '@/features/profile/domain/models/totpStepUpResponse'
import type { TotpSetupRequest } from '@/features/profile/data/requests_models/totpSetupRequest'
import type { TotpEnableRequest } from '@/features/profile/data/requests_models/totpEnableRequest'
import type { TotpDisableRequest } from '@/features/profile/data/requests_models/totpDisableRequest'

export interface TotpActionRepository {
  sendVerifyCode(): Promise<{ success: boolean }>
  initiateSetup(req?: TotpSetupRequest): Promise<TotpSetupResponse>
  enable(req: TotpEnableRequest): Promise<TotpEnableResponse>
  disable(req: TotpDisableRequest): Promise<{ success: boolean }>
  stepUp(code: string): Promise<TotpStepUpResponse>
}
