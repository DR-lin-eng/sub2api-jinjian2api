import type { ClusterDeploymentMode } from '@/features/admin-cluster/domain/models/clusterDeploymentMode'
import type { ClusterWorkerMode } from '@/features/admin-cluster/domain/models/clusterWorkerMode'

export class ClusterDeploymentStatus {
  mode!: ClusterDeploymentMode
  nodeName!: string
  runnerId!: string
  workerMode!: ClusterWorkerMode
  workerEnabled!: boolean
  frontendEnabled!: boolean
  heartbeatIntervalSeconds!: number
  staleAfterSeconds!: number
  taskLeaseSeconds!: number
}
