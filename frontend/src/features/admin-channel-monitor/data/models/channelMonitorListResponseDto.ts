import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { ChannelMonitorListResponse } from '@/features/admin-channel-monitor/domain/models/channelMonitorListResponse'
import { ChannelMonitorDto } from '@/features/admin-channel-monitor/data/models/channelMonitorDto'

export class ChannelMonitorListResponseDto {
  @Expose()
  @Type(() => ChannelMonitorDto)
  @Transform(({ value }) => value ?? [])
  items!: ChannelMonitorDto[]

  @Expose()
  @Transform(({ value }) => value ?? 0)
  total!: number

  @Expose()
  @Transform(({ value }) => value ?? 1)
  page!: number

  @Expose({ name: 'page_size' })
  @Transform(({ value }) => value ?? 20)
  pageSize!: number

  @Expose()
  @Transform(({ value }) => value ?? 0)
  pages!: number

  static fromJson(json: unknown): ChannelMonitorListResponseDto {
    return plainToInstance(ChannelMonitorListResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ChannelMonitorListResponse {
    const e = new ChannelMonitorListResponse()
    e.items = (this.items ?? []).map(i => i.toEntity())
    e.total = this.total
    e.page = this.page
    e.pageSize = this.pageSize
    e.pages = this.pages
    return e
  }
}
