/**
 * AdminCluster Query Datasource — GET endpoints only. Per spec §5.1 R1.
 */
import { apiClient } from '@/core/networks/client'
import { ClusterStatusResponseDto } from '@/features/admin-cluster/data/models/clusterStatusResponseDto'

export class AdminClusterQueryDatasource {
  async getStatus(options?: { signal?: AbortSignal }): Promise<ClusterStatusResponseDto> {
    const { data } = await apiClient.get<unknown>('/admin/cluster/status', {
      signal: options?.signal,
    })
    return ClusterStatusResponseDto.fromJson(data)
  }
}

export const adminClusterQueryDatasource = new AdminClusterQueryDatasource()
