import type { RollbackVersionInfo } from '@/features/admin-settings/domain/models/system'

export interface RollbackVersionInfoDto {
  version: string
  published_at: string
  html_url: string
}

export function toEntity(dto: RollbackVersionInfoDto): RollbackVersionInfo {
  return {
    version: dto.version ?? '',
    publishedAt: dto.published_at ?? '',
    htmlUrl: dto.html_url ?? '',
  }
}
