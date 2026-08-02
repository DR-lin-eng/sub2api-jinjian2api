import { apiClient } from '@/core/networks/client'
import {
  creationOptionsFromJSON,
  requirePasskeySupport,
  serializeRegistrationCredential,
  type PasskeyCeremonyOptionsResponse,
} from '@/core/utils/passkeyCeremony'
import { PasskeyCredentialSummaryDto } from '@/features/passkeys/data/models/passkeyCredentialSummaryDto'
import type { RegisterPasskeyRequest } from '@/features/passkeys/data/requests_models/registerPasskeyRequest'
import type { RenamePasskeyRequest } from '@/features/passkeys/data/requests_models/renamePasskeyRequest'
import type { RemovePasskeyRequest } from '@/features/passkeys/data/requests_models/removePasskeyRequest'

export class PasskeysActionDatasource {
  async register(req: RegisterPasskeyRequest): Promise<PasskeyCredentialSummaryDto> {
    requirePasskeySupport()
    const { data: begin } = await apiClient.post<PasskeyCeremonyOptionsResponse>(
      '/user/passkeys/register/begin',
      { password: req.password }
    )
    const credential = await navigator.credentials.create({
      publicKey: creationOptionsFromJSON(begin.options.publicKey)
    })
    if (!(credential instanceof PublicKeyCredential)) {
      throw new Error('Passkey creation was cancelled')
    }
    const { data } = await apiClient.post<unknown>('/user/passkeys/register/finish', {
      session_token: begin.session_token,
      name: req.name,
      credential: serializeRegistrationCredential(credential)
    })
    return PasskeyCredentialSummaryDto.fromJson(data)
  }

  async rename(id: number, req: RenamePasskeyRequest): Promise<void> {
    await apiClient.patch(`/user/passkeys/${id}`, req)
  }

  async remove(id: number, req: RemovePasskeyRequest): Promise<void> {
    await apiClient.delete(`/user/passkeys/${id}`, { data: req })
  }
}

export const passkeysActionDatasource = new PasskeysActionDatasource()
