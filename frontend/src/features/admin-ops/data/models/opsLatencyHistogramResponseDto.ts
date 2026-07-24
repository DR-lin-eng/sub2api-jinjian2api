import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpsLatencyHistogramBucket, OpsLatencyHistogramResponse } from '@/features/admin-ops/domain/models/opsLatencyHistogramResponse'

export class OpsLatencyHistogramBucketDto {
  @Expose() @Transform(({ value }) => value ?? '') range!: string
  @Expose() @Transform(({ value }) => value ?? 0) count!: number

  static fromJson(json: unknown): OpsLatencyHistogramBucketDto {
    return plainToInstance(OpsLatencyHistogramBucketDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsLatencyHistogramBucket {
    const e = new OpsLatencyHistogramBucket()
    e.range = this.range
    e.count = this.count
    return e
  }
}

export class OpsLatencyHistogramResponseDto {
  @Expose({ name: 'start_time' }) @Transform(({ value }) => value ?? '') startTime!: string
  @Expose({ name: 'end_time' }) @Transform(({ value }) => value ?? '') endTime!: string
  @Expose() @Transform(({ value }) => value ?? '') platform!: string
  @Expose({ name: 'group_id' }) @Transform(({ value }) => value ?? 0) groupId!: number
  @Expose({ name: 'total_requests' }) @Transform(({ value }) => value ?? 0) totalRequests!: number
  @Expose() @Type(() => OpsLatencyHistogramBucketDto) @Transform(({ value }) => value ?? []) buckets!: OpsLatencyHistogramBucketDto[]

  static fromJson(json: unknown): OpsLatencyHistogramResponseDto {
    return plainToInstance(OpsLatencyHistogramResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsLatencyHistogramResponse {
    const e = new OpsLatencyHistogramResponse()
    e.startTime = this.startTime
    e.endTime = this.endTime
    e.platform = this.platform
    e.groupId = this.groupId
    e.totalRequests = this.totalRequests
    e.buckets = (this.buckets ?? []).map(d => d.toEntity())
    return e
  }
}
