import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ApplyTemplateResponse } from '@/features/admin-channel-monitor/domain/models/applyTemplateResponse'

export class ApplyTemplateResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? 0)
  affected!: number

  static fromJson(json: unknown): ApplyTemplateResponseDto {
    return plainToInstance(ApplyTemplateResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ApplyTemplateResponse {
    const e = new ApplyTemplateResponse()
    e.affected = this.affected
    return e
  }
}
