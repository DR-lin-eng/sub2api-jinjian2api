import { authQueryDatasource } from '@/features/auth/data/datasources/authQueryDatasource'
import type { AuthQueryRepository } from '@/features/auth/domain/repositories/authQueryRepository'
import type { CurrentUserResponse } from '@/features/auth/domain/models/currentUserResponse'
import type { PublicSettings } from '@/core/models/domain/publicSettings'
import type { LocalCaptchaChallenge } from '@/features/auth/domain/models/localCaptchaChallenge'

class AuthQueryRepositoryImpl implements AuthQueryRepository {
  private readonly ds = authQueryDatasource

  getCurrentUser = async () : Promise<CurrentUserResponse>  => {
    return (await this.ds.getCurrentUser()).toEntity()
  }

  getPublicSettings = async () : Promise<PublicSettings>  => {
    return (await this.ds.getPublicSettings()).toEntity()
  }

  getLocalCaptcha = async () : Promise<LocalCaptchaChallenge>  => {
    return (await this.ds.getLocalCaptcha()).toEntity()
  }
}

export const authQueryRepository: AuthQueryRepository = new AuthQueryRepositoryImpl()
