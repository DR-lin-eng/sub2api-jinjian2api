import type { VersionInfo, ReleaseInfo } from '@/features/admin-settings/domain/models/system'

interface ReleaseInfoDto {
  name: string
  body: string
  published_at: string
  html_url: string
}

export interface VersionInfoDto {
  current_version: string
  latest_version: string
  has_update: boolean
  release_info?: ReleaseInfoDto
  cached: boolean
  warning?: string
  build_type: string
}

function toReleaseInfo(dto: ReleaseInfoDto): ReleaseInfo {
  return {
    name: dto.name ?? '',
    body: dto.body ?? '',
    publishedAt: dto.published_at ?? '',
    htmlUrl: dto.html_url ?? '',
  }
}

export function toEntity(dto: VersionInfoDto): VersionInfo {
  return {
    currentVersion: dto.current_version ?? '',
    latestVersion: dto.latest_version ?? '',
    hasUpdate: dto.has_update ?? false,
    releaseInfo: dto.release_info ? toReleaseInfo(dto.release_info) : undefined,
    cached: dto.cached ?? false,
    warning: dto.warning,
    buildType: dto.build_type ?? '',
  }
}
