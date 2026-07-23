import type { ClusterInstanceStatus } from '@/features/admin-cluster/domain/models/clusterInstanceStatus'

export class ClusterInstance {
  runnerId!: string
  nodeName!: string
  deploymentMode!: string
  workerMode!: string
  workerEnabled!: boolean
  version!: string
  hostname!: string
  processId!: number
  databaseOk!: boolean
  redisOk!: boolean
  startedAt!: string
  lastSeenAt!: string
  stoppedAt!: string
  status!: ClusterInstanceStatus
  current!: boolean
}
