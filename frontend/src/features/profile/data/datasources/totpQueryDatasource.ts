import { apiClient } from '@/core/networks/client'
import { TotpStatusDto } from '@/features/profile/data/models/totpStatusDto'
import { TotpVerificationMethodDto } from '@/features/profile/data/models/totpVerificationMethodDto'

export class TotpQueryDatasource {
  async getStatus(): Promise<TotpStatusDto> {
    const { data } = await apiClient.get<unknown>('/user/totp/status')
    return TotpStatusDto.fromJson(data)
  }

  async getVerificationMethod(): Promise<TotpVerificationMethodDto> {
    const { data } = await apiClient.get<unknown>('/user/totp/verification-method')
    return TotpVerificationMethodDto.fromJson(data)
  }
}

export const totpQueryDatasource = new TotpQueryDatasource()
