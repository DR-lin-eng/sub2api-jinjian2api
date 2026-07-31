import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ClientIpResolutionStatus } from '@/features/admin-settings/domain/models/clientIpResolutionStatus'

export class ClientIpResolutionStatusDto {
  @Expose() @Transform(({ value }) => value ?? 'auto_compat') mode!: 'auto_compat' | 'trusted_proxy' | 'direct'
  @Expose({ name: 'custom_prefix_count' }) @Transform(({ value }) => value ?? 0) customPrefixCount!: number
  @Expose({ name: 'static_prefix_count' }) @Transform(({ value }) => value ?? 0) staticPrefixCount!: number
  @Expose({ name: 'cloudflare_prefix_count' }) @Transform(({ value }) => value ?? 0) cloudflarePrefixCount!: number
  @Expose({ name: 'cloudflare_ranges_source' }) @Transform(({ value }) => value ?? 'embedded') cloudflareRangesSource!: 'embedded' | 'refreshed'
  @Expose({ name: 'cloudflare_last_success_at' }) @Transform(({ value }) => value ?? null) cloudflareLastSuccessAt!: string | null

  static fromJson(json: unknown): ClientIpResolutionStatusDto {
    return plainToInstance(ClientIpResolutionStatusDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ClientIpResolutionStatus {
    const e = new ClientIpResolutionStatus()
    e.mode = this.mode
    e.customPrefixCount = this.customPrefixCount
    e.staticPrefixCount = this.staticPrefixCount
    e.cloudflarePrefixCount = this.cloudflarePrefixCount
    e.cloudflareRangesSource = this.cloudflareRangesSource
    e.cloudflareLastSuccessAt = this.cloudflareLastSuccessAt
    return e
  }
}
