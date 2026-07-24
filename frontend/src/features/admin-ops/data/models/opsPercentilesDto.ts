import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { OpsPercentiles } from '@/features/admin-ops/domain/models/opsPercentiles'

export class OpsPercentilesDto {
  @Expose({ name: 'p50_ms' }) @Transform(({ value }) => value ?? 0) p50Ms!: number
  @Expose({ name: 'p90_ms' }) @Transform(({ value }) => value ?? 0) p90Ms!: number
  @Expose({ name: 'p95_ms' }) @Transform(({ value }) => value ?? 0) p95Ms!: number
  @Expose({ name: 'p99_ms' }) @Transform(({ value }) => value ?? 0) p99Ms!: number
  @Expose({ name: 'avg_ms' }) @Transform(({ value }) => value ?? 0) avgMs!: number
  @Expose({ name: 'max_ms' }) @Transform(({ value }) => value ?? 0) maxMs!: number

  static fromJson(json: unknown): OpsPercentilesDto {
    return plainToInstance(OpsPercentilesDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): OpsPercentiles {
    const e = new OpsPercentiles()
    e.p50Ms = this.p50Ms
    e.p90Ms = this.p90Ms
    e.p95Ms = this.p95Ms
    e.p99Ms = this.p99Ms
    e.avgMs = this.avgMs
    e.maxMs = this.maxMs
    return e
  }
}
