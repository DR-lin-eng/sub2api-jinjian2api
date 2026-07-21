/**
 * AdminClusterRepositoryImpl. Auto-generated from adminClusterDatasource.ts.
 * Uses getters so the ds.* references are looked up lazily; that keeps
 * partial vi.mock in specs working AND preserves original function
 * identity (including type predicates and `typeof` shape).
 */
import * as ds from '@/features/admin-cluster/data/datasources/adminClusterDatasource'
import type { AdminClusterRepository } from '@/features/admin-cluster/domain/repositories/adminClusterRepository'

export class AdminClusterRepositoryImpl implements AdminClusterRepository {
  get getClusterStatus(): typeof ds.getClusterStatus { return ds.getClusterStatus }
}

export const adminClusterRepository: AdminClusterRepository = new AdminClusterRepositoryImpl()
