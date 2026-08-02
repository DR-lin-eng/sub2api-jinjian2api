import type { PasskeyCredentialSummary } from '@/features/passkeys/domain/models/passkeyCredentialSummary'

export interface PasskeysQueryRepository {
  isSupported(): boolean
  list(): Promise<PasskeyCredentialSummary[]>
}
