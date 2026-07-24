import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpsErrorDistributionItem, OpsErrorDistributionResponse } from '@/features/admin-ops/domain/models/opsErrorDistributionResponse'

export class OpsErrorDistributionItemDto {
  @Expose({ name: 'status_code' }) @Transform(({ value }) => value ?? 0) statusCode!: number
  @Expose() @Transform(({ value }) => value ?? 0) total!: number
  @Expose() @Transform(({ value }) => value ?? 0) sla!: number
  @Expose({ name: 'business_limited' }) @Transform(({ value }) => value ?? 0) businessLimited!: number

  static fromJson(json: unknown): OpsErrorDistributionItemDto {
    return plainToInstance(OpsErrorDistributionItemDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsErrorDistributionItem {
    const e = new OpsErrorDistributionItem()
    e.statusCode = this.statusCode
    e.total = this.total
    e.sla = this.sla
    e.businessLimited = this.businessLimited
    return e
  }
}

export class OpsErrorDistributionResponseDto {
  @Expose() @Transform(({ value }) => value ?? 0) total!: number
  @Expose() @Type(() => OpsErrorDistributionItemDto) @Transform(({ value }) => value ?? []) items!: OpsErrorDistributionItemDto[]

  static fromJson(json: unknown): OpsErrorDistributionResponseDto {
    return plainToInstance(OpsErrorDistributionResponseDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsErrorDistributionResponse {
    const e = new OpsErrorDistributionResponse()
    e.total = this.total
    e.items = (this.items ?? []).map(d => d.toEntity())
    return e
  }
}
