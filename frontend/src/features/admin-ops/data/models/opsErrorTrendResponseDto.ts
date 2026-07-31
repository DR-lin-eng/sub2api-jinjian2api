import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpsErrorTrendResponse } from '@/features/admin-ops/domain/models/opsErrorTrendResponse'
import { OpsErrorTrendPoint } from '@/features/admin-ops/domain/models/opsErrorTrendPoint'

export class OpsErrorTrendPointDto {
  @Expose({ name: 'bucket_start' }) @Transform(({ value }) => value ?? '') bucketStart!: string
  @Expose({ name: 'error_count_total' }) @Transform(({ value }) => value ?? 0) errorCountTotal!: number
  @Expose({ name: 'business_limited_count' }) @Transform(({ value }) => value ?? 0) businessLimitedCount!: number
  @Expose({ name: 'error_count_sla' }) @Transform(({ value }) => value ?? 0) errorCountSla!: number
  @Expose({ name: 'upstream_error_count_excl_429_529' }) @Transform(({ value }) => value ?? 0) upstreamErrorCountExcl429529!: number
  @Expose({ name: 'upstream_429_count' }) @Transform(({ value }) => value ?? 0) upstream429Count!: number
  @Expose({ name: 'upstream_529_count' }) @Transform(({ value }) => value ?? 0) upstream529Count!: number

  static fromJson(json: unknown): OpsErrorTrendPointDto {
    return plainToInstance(OpsErrorTrendPointDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsErrorTrendPoint {
    const e = new OpsErrorTrendPoint()
    e.bucketStart = this.bucketStart
    e.errorCountTotal = this.errorCountTotal
    e.businessLimitedCount = this.businessLimitedCount
    e.errorCountSla = this.errorCountSla
    e.upstreamErrorCountExcl429529 = this.upstreamErrorCountExcl429529
    e.upstream429Count = this.upstream429Count
    e.upstream529Count = this.upstream529Count
    return e
  }
}

export class OpsErrorTrendResponseDto {
  @Expose() @Transform(({ value }) => value ?? '') bucket!: string
  @Expose() @Type(() => OpsErrorTrendPointDto) @Transform(({ value }) => value ?? []) points!: OpsErrorTrendPointDto[]

  static fromJson(json: unknown): OpsErrorTrendResponseDto {
    return plainToInstance(OpsErrorTrendResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsErrorTrendResponse {
    const e = new OpsErrorTrendResponse()
    e.bucket = this.bucket
    e.points = (this.points ?? []).map(d => d.toEntity())
    return e
  }
}
