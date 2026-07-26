import type { UsageCleanupFilters } from './usageCleanupFilters'

export class UsageCleanupTask {
  id!: number
  status!: string
  createdBy!: number
  deletedRows!: number
  errorMessage!: string
  canceledBy!: number
  canceledAt!: string
  startedAt!: string
  finishedAt!: string
  createdAt!: string
  updatedAt!: string
  filters?: { start_time?: string; end_time?: string } & Partial<UsageCleanupFilters>
}
