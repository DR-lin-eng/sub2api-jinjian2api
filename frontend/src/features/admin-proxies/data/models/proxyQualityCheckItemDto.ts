import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ProxyQualityCheckItem } from '@/features/admin-proxies/domain/models/proxyQualityCheckItem'

export class ProxyQualityCheckItemDto {
  @Expose()
  @Transform(({ value }) => value ?? '')
  target!: string

  @Expose()
  @Transform(({ value }) => value ?? 'fail')
  status!: 'pass' | 'warn' | 'fail' | 'challenge'

  @Expose({ name: 'http_status' })
  httpStatus?: number

  @Expose({ name: 'latency_ms' })
  latencyMs?: number

  @Expose()
  message?: string

  @Expose({ name: 'cf_ray' })
  cfRay?: string

  static fromJson(json: unknown): ProxyQualityCheckItemDto {
    return plainToInstance(ProxyQualityCheckItemDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ProxyQualityCheckItem {
    const entity = new ProxyQualityCheckItem()
    entity.target = this.target
    entity.status = this.status
    entity.httpStatus = this.httpStatus
    entity.latencyMs = this.latencyMs
    entity.message = this.message
    entity.cfRay = this.cfRay
    return entity
  }
}
