import 'reflect-metadata'
import { Expose, Transform, Type, plainToInstance } from 'class-transformer'
import { PromptEventPage } from '@/features/prompt-audit/domain/models/promptEventPage'
import { PromptAuditEventDto } from './promptAuditEventDto'

export class PromptEventPageDto {
  @Expose() @Type(() => PromptAuditEventDto) @Transform(({ value }) => value ?? []) items!: PromptAuditEventDto[]
  @Expose() @Transform(({ value }) => value ?? 0) total!: number
  @Expose() @Transform(({ value }) => value ?? 1) page!: number
  @Expose({ name: 'page_size' }) @Transform(({ value }) => value ?? 20) pageSize!: number
  @Expose() @Transform(({ value }) => value ?? 0) pages!: number

  static fromJson(json: unknown): PromptEventPageDto {
    return plainToInstance(PromptEventPageDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): PromptEventPage {
    const e = new PromptEventPage()
    e.items = this.items.map((item) => item.toEntity())
    e.total = this.total
    e.page = this.page
    e.pageSize = this.pageSize
    e.pages = this.pages
    return e
  }
}
