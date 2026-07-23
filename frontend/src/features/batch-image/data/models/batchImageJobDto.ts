import type { BatchImageJobEntity, BatchImageStatus } from '@/features/batch-image/domain/models/batchImageJob'

export interface BatchImageJobDto {
  id: string
  object: string
  task_name: string
  parent_batch_id?: string | null
  status: BatchImageStatus
  model: string
  provider: string
  item_count: number
  success_count: number
  fail_count: number
  estimated_cost: number
  hold_amount: number
  actual_cost: number | null
  created_at: number
  submitted_at: number | null
  settled_at: number | null
  downloaded_at?: number | null
  output_deleted_at?: number | null
}

export function toEntity(dto: BatchImageJobDto): BatchImageJobEntity {
  return {
    id: dto.id ?? '',
    object: dto.object ?? '',
    taskName: dto.task_name ?? '',
    parentBatchId: dto.parent_batch_id,
    status: dto.status,
    model: dto.model ?? '',
    provider: dto.provider ?? '',
    itemCount: dto.item_count ?? 0,
    successCount: dto.success_count ?? 0,
    failCount: dto.fail_count ?? 0,
    estimatedCost: dto.estimated_cost ?? 0,
    holdAmount: dto.hold_amount ?? 0,
    actualCost: dto.actual_cost ?? null,
    createdAt: dto.created_at ?? 0,
    submittedAt: dto.submitted_at ?? null,
    settledAt: dto.settled_at ?? null,
    downloadedAt: dto.downloaded_at,
    outputDeletedAt: dto.output_deleted_at,
  }
}
