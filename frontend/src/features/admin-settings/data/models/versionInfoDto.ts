import 'reflect-metadata'
import { Expose, Transform, plainToInstance } from 'class-transformer'
import { ReleaseInfo } from '@/features/admin-settings/domain/models/releaseInfo'
import { VersionInfo } from '@/features/admin-settings/domain/models/versionInfo'

class ReleaseInfoDto {
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

export class VersionInfoDto {
  @Expose({ name: 'current_version' }) @Transform(({ value }) => value ?? '') currentVersion!: string
  @Expose({ name: 'latest_version' }) @Transform(({ value }) => value ?? '') latestVersion!: string
  @Expose({ name: 'has_update' }) @Transform(({ value }) => value ?? false) hasUpdate!: boolean
  @Expose({ name: 'release_info' }) releaseInfo?: Record<string, unknown>
  @Expose() @Transform(({ value }) => value ?? false) cached!: boolean
  @Expose() warning?: string
  @Expose({ name: 'build_type' }) @Transform(({ value }) => value ?? '') buildType!: string

  static fromJson(json: unknown): VersionInfoDto {
    return plainToInstance(VersionInfoDto, json, { excludeExtraneousValues: true })
  }

  toEntity(): VersionInfo {
    const e = new VersionInfo()
    e.currentVersion = this.currentVersion
    e.latestVersion = this.latestVersion
    e.hasUpdate = this.hasUpdate
    e.releaseInfo = this.releaseInfo ? ReleaseInfoDto.fromJson(this.releaseInfo).toEntity() : undefined
    e.cached = this.cached
    e.warning = this.warning
    e.buildType = this.buildType
    return e
  }
}
