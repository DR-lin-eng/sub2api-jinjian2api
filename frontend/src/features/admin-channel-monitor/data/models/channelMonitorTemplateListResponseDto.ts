import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { ChannelMonitorTemplateListResponse } from '@/features/admin-channel-monitor/domain/models/channelMonitorTemplateListResponse'
import { ChannelMonitorTemplateDto } from '@/features/admin-channel-monitor/data/models/channelMonitorTemplateDto'

export class ChannelMonitorTemplateListResponseDto {
  @Expose()
  @Type(() => ChannelMonitorTemplateDto)
  @Transform(({ value }) => value ?? [])
  items!: ChannelMonitorTemplateDto[]

  static fromJson(json: unknown): ChannelMonitorTemplateListResponseDto {
    return plainToInstance(ChannelMonitorTemplateListResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ChannelMonitorTemplateListResponse {
    const e = new ChannelMonitorTemplateListResponse()
    e.items = (this.items ?? []).map(i => i.toEntity())
    return e
  }
}
