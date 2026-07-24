import { authQueryDatasource } from '@/features/auth/data/datasources/authQueryDatasource'
import type { AuthQueryRepository } from '@/features/auth/domain/repositories/authQueryRepository'
import type { CurrentUserResponse } from '@/features/auth/domain/models/currentUserResponse'
import type { PublicSettings } from '@/features/auth/domain/models/publicSettings'
import type { LocalCaptchaChallenge } from '@/features/auth/domain/models/localCaptchaChallenge'

class AuthQueryRepositoryImpl implements AuthQueryRepository {
  private readonly ds = authQueryDatasource

  async getCurrentUser(): Promise<CurrentUserResponse> {
    return (await this.ds.getCurrentUser()).toEntity()
  }

  async getPublicSettings(): Promise<PublicSettings> {
    return (await this.ds.getPublicSettings()).toEntity()
  }

  async getLocalCaptcha(): Promise<LocalCaptchaChallenge> {
    return (await this.ds.getLocalCaptcha()).toEntity()
  }
}

export const authQueryRepository: AuthQueryRepository = new AuthQueryRepositoryImpl()
