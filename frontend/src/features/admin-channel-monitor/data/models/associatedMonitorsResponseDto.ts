import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { AssociatedMonitorsResponse } from '@/features/admin-channel-monitor/domain/models/associatedMonitorsResponse'
import { AssociatedMonitorBriefDto } from '@/features/admin-channel-monitor/data/models/associatedMonitorBriefDto'

export class AssociatedMonitorsResponseDto {
  @Expose()
  @Type(() => AssociatedMonitorBriefDto)
  @Transform(({ value }) => value ?? [])
  items!: AssociatedMonitorBriefDto[]

  static fromJson(json: unknown): AssociatedMonitorsResponseDto {
    return plainToInstance(AssociatedMonitorsResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): AssociatedMonitorsResponse {
    const e = new AssociatedMonitorsResponse()
    e.items = (this.items ?? []).map(i => i.toEntity())
    return e
  }
}
