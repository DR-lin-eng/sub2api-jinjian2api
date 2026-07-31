import { apiClient } from '@/core/networks/client'
import { TlsFingerprintProfileDto } from '@/features/admin-settings/data/models/tlsFingerprintProfileDto'

export class TlsFingerprintProfileQueryDatasource {
  async list(): Promise<TlsFingerprintProfileDto[]> {
    const { data } = await apiClient.get<unknown[]>('/admin/tls-fingerprint-profiles')
    return (data ?? []).map(item => TlsFingerprintProfileDto.fromJson(item))
  }

  async getById(id: number): Promise<TlsFingerprintProfileDto> {
    const { data } = await apiClient.get<unknown>(`/admin/tls-fingerprint-profiles/${id}`)
    return TlsFingerprintProfileDto.fromJson(data)
  }
}

export const tlsFingerprintProfileQueryDatasource = new TlsFingerprintProfileQueryDatasource()
