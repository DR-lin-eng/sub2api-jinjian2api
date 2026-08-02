import type { PasskeyCredentialSummary } from '@/features/passkeys/domain/models/passkeyCredentialSummary'
import type { RegisterPasskeyRequest } from '@/features/passkeys/data/requests_models/registerPasskeyRequest'
import type { RenamePasskeyRequest } from '@/features/passkeys/data/requests_models/renamePasskeyRequest'
import type { RemovePasskeyRequest } from '@/features/passkeys/data/requests_models/removePasskeyRequest'

export interface PasskeysActionRepository {
  register(req: RegisterPasskeyRequest): Promise<PasskeyCredentialSummary>
  rename(id: number, req: RenamePasskeyRequest): Promise<void>
  remove(id: number, req: RemovePasskeyRequest): Promise<void>
}
