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

export class BatchImageJob {
  id!: string
  object!: string
  taskName!: string
  parentBatchId!: string
  status!: BatchImageStatus
  model!: string
  provider!: string
  itemCount!: number
  successCount!: number
  failCount!: number
  estimatedCost!: number
  holdAmount!: number
  actualCost!: number
  costSettled!: boolean
  createdAt!: number
  submittedAt!: number
  settledAt!: number
  downloadedAt!: number
  outputDeletedAt!: number
}
