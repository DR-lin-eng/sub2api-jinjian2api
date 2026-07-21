/**
 * AdminClusterRepository (interface). Auto-generated from adminClusterDatasource.ts.
 */
import type * as ds from '@/features/admin-cluster/data/datasources/adminClusterDatasource'

export type AdminClusterRepository = {
  readonly getClusterStatus: typeof ds.getClusterStatus
}
