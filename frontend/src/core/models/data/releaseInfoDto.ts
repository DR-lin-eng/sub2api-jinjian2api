import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ReleaseInfo } from '@/core/models/domain/releaseInfo'

export class ReleaseInfoDto {
  @Expose() @Transform(({ value }) => value ?? '') name!: string
  @Expose() @Transform(({ value }) => value ?? '') body!: string
  @Expose({ name: 'published_at' }) @Transform(({ value }) => value ?? '') publishedAt!: string
  @Expose({ name: 'html_url' }) @Transform(({ value }) => value ?? '') htmlUrl!: string

  static fromJson(json: unknown): ReleaseInfoDto {
    return plainToInstance(ReleaseInfoDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): ReleaseInfo {
    const e = new ReleaseInfo()
    e.name = this.name
    e.body = this.body
    e.publishedAt = this.publishedAt
    e.htmlUrl = this.htmlUrl
    return e
  }
}
