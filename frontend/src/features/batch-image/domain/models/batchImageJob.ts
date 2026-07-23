export type BatchImageStatus =
  | 'queued'
  | 'running'
  | 'indexing'
  | 'processing_results'
  | 'settling'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'output_deleted'
  | string

export interface BatchImageJobEntity {
  id: string
  object: string
  taskName: string
  parentBatchId?: string | null
  status: BatchImageStatus
  model: string
  provider: string
  itemCount: number
  successCount: number
  failCount: number
  estimatedCost: number
  holdAmount: number
  actualCost: number | null
  createdAt: number
  submittedAt: number | null
  settledAt: number | null
  downloadedAt?: number | null
  outputDeletedAt?: number | null
}
