import type { BatchImageModelEntity } from '@/features/batch-image/domain/models/batchImageModel'

export interface BatchImageModelDto {
  id: string
  object: string
  provider: string
}

export function toEntity(dto: BatchImageModelDto): BatchImageModelEntity {
  return {
    id: dto.id ?? '',
    object: dto.object ?? '',
    provider: dto.provider ?? '',
  }
}
