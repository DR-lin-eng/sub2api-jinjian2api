import { WindowStats } from '@/features/admin-accounts/domain/models/windowStats'

export class UsageProgress {
  utilization!: number
  resetsAt!: string
  remainingSeconds!: number
  windowStats?: WindowStats
  usedRequests!: number
  limitRequests!: number
}
