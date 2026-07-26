import { apiClient } from '@/core/networks/client'
import { LocalCaptchaChallengeDto } from '@/features/auth/data/models/localCaptchaChallengeDto'
import { CurrentUserResponseDto } from '@/features/auth/data/models/currentUserResponseDto'
import { PublicSettingsDto } from '@/core/models/data/publicSettingsDto'

export class AuthQueryDatasource {
  async getCurrentUser(): Promise<CurrentUserResponseDto> {
    const { data } = await apiClient.get<unknown>('/auth/me')
    return CurrentUserResponseDto.fromJson(data)
  }

  async getPublicSettings(): Promise<PublicSettingsDto> {
    const { data } = await apiClient.get<unknown>('/settings/public')
    return PublicSettingsDto.fromJson(data)
  }

  async getLocalCaptcha(): Promise<LocalCaptchaChallengeDto> {
    const { data } = await apiClient.get<unknown>('/auth/captcha')
    return LocalCaptchaChallengeDto.fromJson(data)
  }
}

export const authQueryDatasource = new AuthQueryDatasource()
