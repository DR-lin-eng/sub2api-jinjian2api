import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { WebSearchTestResult } from '@/features/admin-settings/domain/models/webSearchTestResult'

export class WebSearchTestResultDto {
  @Expose() @Transform(({ value }) => value ?? '') provider!: string
  @Expose() @Transform(({ value }) => value ?? []) results!: Array<{ title: string; url: string; snippet: string }>

  static fromJson(json: unknown): WebSearchTestResultDto {
    return plainToInstance(WebSearchTestResultDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): WebSearchTestResult {
    const e = new WebSearchTestResult()
    e.provider = this.provider
    e.results = this.results
    return e
  }
}
