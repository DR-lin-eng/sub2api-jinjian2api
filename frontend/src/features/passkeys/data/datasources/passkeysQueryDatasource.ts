import { apiClient } from '@/core/networks/client'
import { PasskeyCredentialSummaryDto } from '@/features/passkeys/data/models/passkeyCredentialSummaryDto'

export class PasskeysQueryDatasource {
  isSupported(): boolean {
    return Boolean(window.PublicKeyCredential && navigator.credentials)
  }

  async list(): Promise<PasskeyCredentialSummaryDto[]> {
    const { data } = await apiClient.get<unknown[]>('/user/passkeys')
    return data.map((item) => PasskeyCredentialSummaryDto.fromJson(item))
  }
}

export const passkeysQueryDatasource = new PasskeysQueryDatasource()
