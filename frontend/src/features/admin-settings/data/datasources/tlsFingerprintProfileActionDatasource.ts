import { apiClient } from '@/core/networks/client'
import { TlsFingerprintProfileDto } from '@/features/admin-settings/data/models/tlsFingerprintProfileDto'
import type { CreateTlsFingerprintProfileRequest } from '@/features/admin-settings/data/requests_models/createTlsFingerprintProfileRequest'
import type { UpdateTlsFingerprintProfileRequest } from '@/features/admin-settings/data/requests_models/updateTlsFingerprintProfileRequest'

export class TlsFingerprintProfileActionDatasource {
  async create(req: CreateTlsFingerprintProfileRequest): Promise<TlsFingerprintProfileDto> {
    const { data } = await apiClient.post<unknown>('/admin/tls-fingerprint-profiles', req)
    return TlsFingerprintProfileDto.fromJson(data)
  }

  async update(id: number, req: UpdateTlsFingerprintProfileRequest): Promise<TlsFingerprintProfileDto> {
    const { data } = await apiClient.put<unknown>(`/admin/tls-fingerprint-profiles/${id}`, req)
    return TlsFingerprintProfileDto.fromJson(data)
  }

  async deleteProfile(id: number): Promise<{ message: string }> {
    const { data } = await apiClient.delete<{ message: string }>(`/admin/tls-fingerprint-profiles/${id}`)
    return data
  }
}

export const tlsFingerprintProfileActionDatasource = new TlsFingerprintProfileActionDatasource()
