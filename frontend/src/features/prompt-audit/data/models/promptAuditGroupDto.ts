import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { PromptAuditGroup } from '@/features/prompt-audit/domain/models/promptAuditGroup'

export class PromptAuditGroupDto {
  @Expose() @Transform(({ value }) => value ?? 0) id!: number
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose() @Transform(({ value }) => value ?? 'active') status!: 'active' | 'inactive'
  @Expose() @Transform(({ value }) => value ?? '') platform!: string

  static fromJson(json: unknown): PromptAuditGroupDto {
    return plainToInstance(PromptAuditGroupDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PromptAuditGroup {
    const e = new PromptAuditGroup()
    e.id = this.id
    e.name = this.name
    e.status = this.status
    e.platform = this.platform
    return e
  }
}
