import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { BatchTodayStatsResponse } from '@/features/admin-accounts/domain/models/batchTodayStatsResponse'
import { WindowStatsDto } from '@/features/admin-accounts/data/models/windowStatsDto'

export class BatchTodayStatsResponseDto {
  @Expose()
  @Transform(({ value }: { value: Record<string, unknown> | null | undefined }) => {
    if (!value) return {}
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, WindowStatsDto.fromJson(v)]))
  })
  stats!: Record<string, WindowStatsDto>

  static fromJson(json: unknown): BatchTodayStatsResponseDto {
    return plainToInstance(BatchTodayStatsResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): BatchTodayStatsResponse {
    const e = new BatchTodayStatsResponse()
    e.stats = Object.fromEntries(Object.entries(this.stats ?? {}).map(([k, dto]) => [k, dto.toEntity()]))
    return e
  }
}
