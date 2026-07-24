import { authQueryDatasource } from '@/features/auth/data/datasources/authQueryDatasource'
import type { AuthQueryRepository } from '@/features/auth/domain/repositories/authQueryRepository'
import type { CurrentUserResponse, PublicSettings } from '@/types'
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
