import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { HistoryResponse } from '@/features/admin-channel-monitor/domain/models/historyResponse'
import { HistoryItemDto } from '@/features/admin-channel-monitor/data/models/historyItemDto'

export class HistoryResponseDto {
  @Expose()
  @Type(() => HistoryItemDto)
  @Transform(({ value }) => value ?? [])
  items!: HistoryItemDto[]

  static fromJson(json: unknown): HistoryResponseDto {
    return plainToInstance(HistoryResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): HistoryResponse {
    const e = new HistoryResponse()
    e.items = (this.items ?? []).map(i => i.toEntity())
    return e
  }
}
