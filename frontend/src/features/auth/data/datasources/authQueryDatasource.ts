import { apiClient } from '@/core/networks/client'
import { LocalCaptchaChallengeDto } from '@/features/auth/data/models/localCaptchaChallengeDto'
import type { CurrentUserResponse } from '@/features/auth/domain/models/currentUserResponse'
import type { PublicSettings } from '@/features/auth/domain/models/publicSettings'

export class AuthQueryDatasource {
  async getCurrentUser(): Promise<CurrentUserResponse> {
    const { data } = await apiClient.get<CurrentUserResponse>('/auth/me')
    return data
  }

  async getPublicSettings(): Promise<PublicSettings> {
    const { data } = await apiClient.get<PublicSettings>('/settings/public')
    return data
  }

  async getLocalCaptcha(): Promise<LocalCaptchaChallengeDto> {
    const { data } = await apiClient.get<unknown>('/auth/captcha')
    return LocalCaptchaChallengeDto.fromJson(data)
  }
}

export const authQueryDatasource = new AuthQueryDatasource()
