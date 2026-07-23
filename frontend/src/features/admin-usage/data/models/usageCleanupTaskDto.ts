import type { UsageCleanupTask } from '@/features/admin-usage/domain/models/adminUsage'

export interface UsageCleanupTaskDto {
  id: number
  status: string
  created_by: number
  deleted_rows: number
  error_message?: string | null
  canceled_by?: number | null
  canceled_at?: string | null
  started_at?: string | null
  finished_at?: string | null
  created_at: string
  updated_at: string
}

export function toEntity(dto: UsageCleanupTaskDto): UsageCleanupTask {
  return {
    id: dto.id ?? 0,
    status: dto.status ?? '',
    createdBy: dto.created_by ?? 0,
    deletedRows: dto.deleted_rows ?? 0,
    errorMessage: dto.error_message,
    canceledBy: dto.canceled_by,
    canceledAt: dto.canceled_at,
    startedAt: dto.started_at,
    finishedAt: dto.finished_at,
    createdAt: dto.created_at ?? '',
    updatedAt: dto.updated_at ?? '',
  }
}
