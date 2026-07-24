import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpsThroughputPlatformBreakdown, OpsThroughputGroupBreakdown, OpsThroughputTrendResponse } from '@/features/admin-ops/domain/models/opsThroughputTrendResponse'
import { OpsThroughputTrendPointDto } from './opsThroughputTrendPointDto'

export class OpsThroughputPlatformBreakdownDto {
  @Expose() @Transform(({ value }) => value ?? '') platform!: string
  @Expose({ name: 'request_count' }) @Transform(({ value }) => value ?? 0) requestCount!: number
  @Expose({ name: 'token_consumed' }) @Transform(({ value }) => value ?? 0) tokenConsumed!: number

  static fromJson(json: unknown): OpsThroughputPlatformBreakdownDto {
    return plainToInstance(OpsThroughputPlatformBreakdownDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsThroughputPlatformBreakdown {
    const e = new OpsThroughputPlatformBreakdown()
    e.platform = this.platform
    e.requestCount = this.requestCount
    e.tokenConsumed = this.tokenConsumed
    return e
  }
}

export class OpsThroughputGroupBreakdownDto {
  @Expose({ name: 'group_id' }) @Transform(({ value }) => value ?? 0) groupId!: number
  @Expose({ name: 'group_name' }) @Transform(({ value }) => value ?? '') groupName!: string
  @Expose() @Transform(({ value }) => value ?? '') platform!: string
  @Expose({ name: 'request_count' }) @Transform(({ value }) => value ?? 0) requestCount!: number
  @Expose({ name: 'token_consumed' }) @Transform(({ value }) => value ?? 0) tokenConsumed!: number

  static fromJson(json: unknown): OpsThroughputGroupBreakdownDto {
    return plainToInstance(OpsThroughputGroupBreakdownDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsThroughputGroupBreakdown {
    const e = new OpsThroughputGroupBreakdown()
    e.groupId = this.groupId
    e.groupName = this.groupName
    e.platform = this.platform
    e.requestCount = this.requestCount
    e.tokenConsumed = this.tokenConsumed
    return e
  }
}

export class OpsThroughputTrendResponseDto {
  @Expose() @Transform(({ value }) => value ?? '') bucket!: string
  @Expose() @Type(() => OpsThroughputTrendPointDto) @Transform(({ value }) => value ?? []) points!: OpsThroughputTrendPointDto[]
  @Expose({ name: 'by_platform' }) @Type(() => OpsThroughputPlatformBreakdownDto) @Transform(({ value }) => value ?? []) byPlatform!: OpsThroughputPlatformBreakdownDto[]
  @Expose({ name: 'top_groups' }) @Type(() => OpsThroughputGroupBreakdownDto) @Transform(({ value }) => value ?? []) topGroups!: OpsThroughputGroupBreakdownDto[]

  static fromJson(json: unknown): OpsThroughputTrendResponseDto {
    return plainToInstance(OpsThroughputTrendResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsThroughputTrendResponse {
    const e = new OpsThroughputTrendResponse()
    e.bucket = this.bucket
    e.points = (this.points ?? []).map(d => d.toEntity())
    e.byPlatform = (this.byPlatform ?? []).map(d => d.toEntity())
    e.topGroups = (this.topGroups ?? []).map(d => d.toEntity())
    return e
  }
}
