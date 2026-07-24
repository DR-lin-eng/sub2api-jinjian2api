import type { BatchImageStatus } from '@/features/batch-image/enums/batchImageStatus'

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
