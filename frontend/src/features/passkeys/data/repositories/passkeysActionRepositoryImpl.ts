import { passkeysActionDatasource } from '@/features/passkeys/data/datasources/passkeysActionDatasource'
import type { PasskeyCredentialSummary } from '@/features/passkeys/domain/models/passkeyCredentialSummary'
import type { PasskeysActionRepository } from '@/features/passkeys/domain/repositories/passkeysActionRepository'
import type { RegisterPasskeyRequest } from '@/features/passkeys/data/requests_models/registerPasskeyRequest'
import type { RenamePasskeyRequest } from '@/features/passkeys/data/requests_models/renamePasskeyRequest'
import type { RemovePasskeyRequest } from '@/features/passkeys/data/requests_models/removePasskeyRequest'

export class PasskeysActionRepositoryImpl implements PasskeysActionRepository {
  async register(req: RegisterPasskeyRequest): Promise<PasskeyCredentialSummary> {
    return passkeysActionDatasource.register(req).then((dto) => dto.toEntity())
  }

  rename(id: number, req: RenamePasskeyRequest): Promise<void> {
    return passkeysActionDatasource.rename(id, req)
  }

  remove(id: number, req: RemovePasskeyRequest): Promise<void> {
    return passkeysActionDatasource.remove(id, req)
  }
}

export const passkeysActionRepository = new PasskeysActionRepositoryImpl()
