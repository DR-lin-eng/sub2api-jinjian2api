import type { TlsFingerprintProfile } from '@/features/admin-settings/domain/models/tlsFingerprintProfile'

export interface TlsFingerprintProfileDto {
  id: number
  name: string
  description: string | null
  enable_grease: boolean
  cipher_suites: number[]
  curves: number[]
  point_formats: number[]
  signature_algorithms: number[]
  alpn_protocols: string[]
  supported_versions: number[]
  key_share_groups: number[]
  psk_modes: number[]
  extensions: number[]
  created_at: string
  updated_at: string
}

export function toEntity(dto: TlsFingerprintProfileDto): TlsFingerprintProfile {
  return {
    id: dto.id,
    name: dto.name ?? '',
    description: dto.description ?? null,
    enableGrease: dto.enable_grease ?? false,
    cipherSuites: dto.cipher_suites ?? [],
    curves: dto.curves ?? [],
    pointFormats: dto.point_formats ?? [],
    signatureAlgorithms: dto.signature_algorithms ?? [],
    alpnProtocols: dto.alpn_protocols ?? [],
    supportedVersions: dto.supported_versions ?? [],
    keyShareGroups: dto.key_share_groups ?? [],
    pskModes: dto.psk_modes ?? [],
    extensions: dto.extensions ?? [],
    createdAt: dto.created_at ?? '',
    updatedAt: dto.updated_at ?? '',
  }
}
