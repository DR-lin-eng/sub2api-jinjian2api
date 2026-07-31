import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { RunNowResponse } from '@/features/admin-channel-monitor/domain/models/runNowResponse'
import { CheckResultDto } from '@/features/admin-channel-monitor/data/models/checkResultDto'

export class RunNowResponseDto {
  @Expose()
  @Type(() => CheckResultDto)
  @Transform(({ value }) => value ?? [])
  results!: CheckResultDto[]

  static fromJson(json: unknown): RunNowResponseDto {
    return plainToInstance(RunNowResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): RunNowResponse {
    const e = new RunNowResponse()
    e.results = (this.results ?? []).map(r => r.toEntity())
    return e
  }
}
