import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { UpstreamBillingProbeResult } from '@/features/admin-accounts/domain/models/upstreamBillingProbeResult'
import { UpstreamBillingProbeSnapshotDto } from '@/features/admin-accounts/data/models/upstreamBillingProbeSnapshotDto'

export class UpstreamBillingProbeResultDto {
  @Expose({ name: 'account_id' }) @Transform(({ value }) => value ?? 0) accountId!: number
  @Expose() @Type(() => UpstreamBillingProbeSnapshotDto) snapshot?: UpstreamBillingProbeSnapshotDto
  @Expose() @Transform(({ value }) => value ?? '') error!: string

  static fromJson(json: unknown): UpstreamBillingProbeResultDto {
    return plainToInstance(UpstreamBillingProbeResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): UpstreamBillingProbeResult {
    const e = new UpstreamBillingProbeResult()
    e.accountId = this.accountId
    e.snapshot = this.snapshot ? this.snapshot.toEntity() : undefined
    e.error = this.error
    return e
  }
}
