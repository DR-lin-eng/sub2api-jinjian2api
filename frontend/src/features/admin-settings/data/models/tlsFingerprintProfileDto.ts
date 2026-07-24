import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { TlsFingerprintProfile } from '@/features/admin-settings/domain/models/tlsFingerprintProfile'

export class TlsFingerprintProfileDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose() @Transform(({ value }) => value ?? null) description!: string | null
  @Expose({ name: 'enable_grease' }) @Transform(({ value }) => value ?? false) enableGrease!: boolean
  @Expose({ name: 'cipher_suites' }) @Transform(({ value }) => value ?? []) cipherSuites!: number[]
  @Expose() @Transform(({ value }) => value ?? []) curves!: number[]
  @Expose({ name: 'point_formats' }) @Transform(({ value }) => value ?? []) pointFormats!: number[]
  @Expose({ name: 'signature_algorithms' }) @Transform(({ value }) => value ?? []) signatureAlgorithms!: number[]
  @Expose({ name: 'alpn_protocols' }) @Transform(({ value }) => value ?? []) alpnProtocols!: string[]
  @Expose({ name: 'supported_versions' }) @Transform(({ value }) => value ?? []) supportedVersions!: number[]
  @Expose({ name: 'key_share_groups' }) @Transform(({ value }) => value ?? []) keyShareGroups!: number[]
  @Expose({ name: 'psk_modes' }) @Transform(({ value }) => value ?? []) pskModes!: number[]
  @Expose() @Transform(({ value }) => value ?? []) extensions!: number[]
  @Expose({ name: 'created_at' }) @Transform(({ value }) => value ?? '') createdAt!: string
  @Expose({ name: 'updated_at' }) @Transform(({ value }) => value ?? '') updatedAt!: string

  static fromJson(json: unknown): TlsFingerprintProfileDto {
    return plainToInstance(TlsFingerprintProfileDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): TlsFingerprintProfile {
    const e = new TlsFingerprintProfile()
    e.id = this.id
    e.name = this.name
    e.description = this.description
    e.enableGrease = this.enableGrease
    e.cipherSuites = this.cipherSuites
    e.curves = this.curves
    e.pointFormats = this.pointFormats
    e.signatureAlgorithms = this.signatureAlgorithms
    e.alpnProtocols = this.alpnProtocols
    e.supportedVersions = this.supportedVersions
    e.keyShareGroups = this.keyShareGroups
    e.pskModes = this.pskModes
    e.extensions = this.extensions
    e.createdAt = this.createdAt
    e.updatedAt = this.updatedAt
    return e
  }
}
