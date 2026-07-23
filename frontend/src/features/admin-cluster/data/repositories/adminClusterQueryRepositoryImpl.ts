/**
 * AdminClusterQueryRepositoryImpl. Per spec §5.2. DTO → Entity via toEntity().
 */
import { adminClusterQueryDatasource } from '@/features/admin-cluster/data/datasources/adminClusterQueryDatasource'
import type { ClusterStatusResponse } from '@/features/admin-cluster/domain/models/clusterStatusResponse'
import type { AdminClusterQueryRepository } from '@/features/admin-cluster/domain/repositories/adminClusterQueryRepository'

export class AdminClusterQueryRepositoryImpl implements AdminClusterQueryRepository {
  private readonly ds = adminClusterQueryDatasource

  async getStatus(options?: { signal?: AbortSignal }): Promise<ClusterStatusResponse> {
    const dto = await this.ds.getStatus(options)
    return dto.toEntity()
  }
}

export const adminClusterQueryRepository: AdminClusterQueryRepository = new AdminClusterQueryRepositoryImpl()
