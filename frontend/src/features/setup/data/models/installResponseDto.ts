import type { InstallResponse } from '@/features/setup/domain/models/installResponse'

export interface InstallResponseDto {
  message: string
  restart: boolean
}

export function toEntity(dto: InstallResponseDto): InstallResponse {
  return {
    message: dto.message ?? '',
    restart: dto.restart ?? false,
  }
}
