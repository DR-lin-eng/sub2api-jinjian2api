import type { SetupStatus } from '@/features/setup/domain/models/setupStatus'

export interface SetupStatusDto {
  needs_setup: boolean
  step: string
}

export function toEntity(dto: SetupStatusDto): SetupStatus {
  return {
    needsSetup: dto.needs_setup ?? false,
    step: dto.step ?? '',
  }
}
