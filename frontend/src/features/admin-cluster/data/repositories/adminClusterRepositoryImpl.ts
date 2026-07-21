/**
 * AdminClusterRepositoryImpl. Auto-generated from adminClusterDatasource.ts by .tmp_gen_repo.mjs.
 */
import * as ds from '@/features/admin-cluster/data/datasources/adminClusterDatasource'
import type { AdminClusterRepository } from '@/features/admin-cluster/domain/repositories/adminClusterRepository'

export class AdminClusterRepositoryImpl implements AdminClusterRepository {
  getClusterStatus = ds.getClusterStatus
}

export const adminClusterRepository: AdminClusterRepository = new AdminClusterRepositoryImpl()
