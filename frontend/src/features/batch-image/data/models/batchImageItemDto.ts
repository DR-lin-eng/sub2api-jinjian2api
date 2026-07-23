import type { BatchImageItemEntity, BatchImageItemError } from '@/features/batch-image/domain/models/batchImageItem'

export interface BatchImageItemErrorDto {
  code: string
  message: string
  source?: string
}

export interface BatchImageItemDto {
  batch_id?: string
  source_task_name?: string
  custom_id: string
  status: string
  prompt_preview?: string | null
  mime_type: string | null
  file_extension: string | null
  image_count: number
  error?: BatchImageItemErrorDto | null
}

function toItemError(dto: BatchImageItemErrorDto): BatchImageItemError {
  return {
    code: dto.code ?? '',
    message: dto.message ?? '',
    source: dto.source,
  }
}

export function toEntity(dto: BatchImageItemDto): BatchImageItemEntity {
  return {
    batchId: dto.batch_id,
    sourceTaskName: dto.source_task_name,
    customId: dto.custom_id ?? '',
    status: dto.status ?? '',
    promptPreview: dto.prompt_preview,
    mimeType: dto.mime_type ?? null,
    fileExtension: dto.file_extension ?? null,
    imageCount: dto.image_count ?? 0,
    error: dto.error ? toItemError(dto.error) : undefined,
  }
}
