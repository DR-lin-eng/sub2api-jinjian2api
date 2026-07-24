import { authQueryDatasource } from '@/features/auth/data/datasources/authQueryDatasource'
import type { AuthQueryRepository } from '@/features/auth/domain/repositories/authQueryRepository'
import type { CurrentUserResponse } from '@/features/auth/domain/models/currentUserResponse'
import type { PublicSettings } from '@/features/auth/domain/models/publicSettings'
import type { LocalCaptchaChallenge } from '@/features/auth/domain/models/localCaptchaChallenge'

class AuthQueryRepositoryImpl implements AuthQueryRepository {
  private readonly ds = authQueryDatasource

  async getCurrentUser(): Promise<CurrentUserResponse> {
    return this.ds.getCurrentUser()
  }

  async getPublicSettings(): Promise<PublicSettings> {
    return this.ds.getPublicSettings()
  }

  async getLocalCaptcha(): Promise<LocalCaptchaChallenge> {
    return (await this.ds.getLocalCaptcha()).toEntity()
  }
}

export const authQueryRepository: AuthQueryRepository = new AuthQueryRepositoryImpl()
