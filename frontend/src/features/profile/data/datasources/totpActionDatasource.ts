import { apiClient } from '@/core/networks/client'
import { TotpSetupResponseDto } from '@/features/profile/data/models/totpSetupResponseDto'
import { TotpEnableResponseDto } from '@/features/profile/data/models/totpEnableResponseDto'
import { TotpStepUpResponseDto } from '@/features/profile/data/models/totpStepUpResponseDto'
import type { TotpSetupRequest } from '@/features/profile/data/requests_models/totpSetupRequest'
import type { TotpEnableRequest } from '@/features/profile/data/requests_models/totpEnableRequest'
import type { TotpDisableRequest } from '@/features/profile/data/requests_models/totpDisableRequest'

export class TotpActionDatasource {
  async sendVerifyCode(): Promise<{ success: boolean }> {
    const { data } = await apiClient.post<{ success: boolean }>('/user/totp/send-code')
    return data
  }

  async initiateSetup(req?: TotpSetupRequest): Promise<TotpSetupResponseDto> {
    const { data } = await apiClient.post<unknown>('/user/totp/setup', req ?? {})
    return TotpSetupResponseDto.fromJson(data)
  }

  async enable(req: TotpEnableRequest): Promise<TotpEnableResponseDto> {
    const { data } = await apiClient.post<unknown>('/user/totp/enable', req)
    return TotpEnableResponseDto.fromJson(data)
  }

  async disable(req: TotpDisableRequest): Promise<{ success: boolean }> {
    const { data } = await apiClient.post<{ success: boolean }>('/user/totp/disable', req)
    return data
  }

  async stepUp(code: string): Promise<TotpStepUpResponseDto> {
    const { data } = await apiClient.post<unknown>('/user/totp/step-up', { code })
    return TotpStepUpResponseDto.fromJson(data)
  }
}

export const totpActionDatasource = new TotpActionDatasource()
