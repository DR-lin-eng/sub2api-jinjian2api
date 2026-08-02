import { passkeysQueryDatasource } from '@/features/passkeys/data/datasources/passkeysQueryDatasource'
import type { PasskeyCredentialSummary } from '@/features/passkeys/domain/models/passkeyCredentialSummary'
import type { PasskeysQueryRepository } from '@/features/passkeys/domain/repositories/passkeysQueryRepository'

export class PasskeysQueryRepositoryImpl implements PasskeysQueryRepository {
  isSupported(): boolean {
    return passkeysQueryDatasource.isSupported()
  }

  async list(): Promise<PasskeyCredentialSummary[]> {
    return passkeysQueryDatasource.list().then((items) => items.map((dto) => dto.toEntity()))
  }
}

export const passkeysQueryRepository = new PasskeysQueryRepositoryImpl()
