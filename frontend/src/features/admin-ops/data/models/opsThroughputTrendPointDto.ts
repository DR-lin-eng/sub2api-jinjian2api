import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { OpsThroughputTrendPoint } from '@/features/admin-ops/domain/models/opsThroughputTrendPoint'

export class OpsThroughputTrendPointDto {
  @Expose({ name: 'bucket_start' }) @Transform(({ value }) => value ?? '') bucketStart!: string
  @Expose({ name: 'request_count' }) @Transform(({ value }) => value ?? 0) requestCount!: number
  @Expose({ name: 'token_consumed' }) @Transform(({ value }) => value ?? 0) tokenConsumed!: number
  @Expose({ name: 'switch_count' }) @Transform(({ value }) => value ?? 0) switchCount!: number
  @Expose() @Transform(({ value }) => value ?? 0) qps!: number
  @Expose() @Transform(({ value }) => value ?? 0) tps!: number

  static fromJson(json: unknown): OpsThroughputTrendPointDto {
    return plainToInstance(OpsThroughputTrendPointDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsThroughputTrendPoint {
    const e = new OpsThroughputTrendPoint()
    e.bucketStart = this.bucketStart
    e.requestCount = this.requestCount
    e.tokenConsumed = this.tokenConsumed
    e.switchCount = this.switchCount
    e.qps = this.qps
    e.tps = this.tps
    return e
  }
}
