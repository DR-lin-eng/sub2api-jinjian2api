import type { UpdateResult } from '@/features/admin-settings/domain/models/system'

export interface UpdateResultDto {
  message: string
  need_restart: boolean
}

export function toEntity(dto: UpdateResultDto): UpdateResult {
  return {
    message: dto.message ?? '',
    needRestart: dto.need_restart ?? false,
  }
}
