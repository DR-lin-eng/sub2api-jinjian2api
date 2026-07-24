import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { RollbackVersionInfo } from '@/features/admin-settings/domain/models/rollbackVersionInfo'

export class RollbackVersionInfoDto {
  @Expose() @Transform(({ value }) => value ?? '') version!: string
  @Expose({ name: 'published_at' }) @Transform(({ value }) => value ?? '') publishedAt!: string
  @Expose({ name: 'html_url' }) @Transform(({ value }) => value ?? '') htmlUrl!: string

  static fromJson(json: unknown): RollbackVersionInfoDto {
    return plainToInstance(RollbackVersionInfoDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): RollbackVersionInfo {
    const e = new RollbackVersionInfo()
    e.version = this.version
    e.publishedAt = this.publishedAt
    e.htmlUrl = this.htmlUrl
    return e
  }
}
