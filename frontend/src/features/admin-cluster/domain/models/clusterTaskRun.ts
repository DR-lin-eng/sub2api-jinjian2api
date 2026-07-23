import type { ClusterTaskStatus } from '@/features/admin-cluster/domain/models/clusterTaskStatus'

export class ClusterTaskRun {
  id!: number
  runId!: string
  taskKey!: string
  status!: ClusterTaskStatus
  nodeName!: string
  runnerId!: string
  metadata!: Record<string, unknown>
  result!: Record<string, unknown>
  errorMessage!: string
  startedAt!: string
  heartbeatAt!: string
  leaseUntil!: string
  finishedAt!: string
}
